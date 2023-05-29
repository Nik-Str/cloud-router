// eslint-disable-next-line import/no-cycle
import { App, Res, Req, Middleware } from '..';

export default class Server {
  req: Req;
  res: Res;
  url: URL;

  constructor(req: Request, public app: App, baseHeaders?: Record<string, string>) {
    this.req = req as Req;
    this.res = new Res(req, baseHeaders);
    this.url = new URL(this.req.url);
  }

  public async listen(): Promise<Response> {
    try {
      // Authenticate
      const authHandler = this.app.getAuthHandler();
      if (authHandler) {
        const isResponse = await authHandler(this.req, this.res, this.url);
        if (isResponse instanceof Response) return isResponse;
      }

      // Public
      const path = this.url.pathname.split('/').filter((string) => string);
      const publicRoutes = this.app.getPublicRoutes();
      const publicHandler = publicRoutes[path[0]];
      if (publicHandler) return await publicHandler(this.req, this.res, this.url);

      // Middleware
      const appMiddlewares = this.app.getMiddlewares();
      if (appMiddlewares.length) {
        const isResponse = await this.executeMiddleware(appMiddlewares);
        if (isResponse instanceof Response) return isResponse;
      }

      const router = this.app.getRouters()[path[0]];
      const route = router?.routes.filter(
        (_route) => _route.path === (path.slice(1).join('/') || '/') && _route.method === this.req.method
      )[0];

      // Not found
      if (!router || !route) {
        const notFound = this.app.getNotFoundHandler();
        if (notFound) return await notFound(this.req, this.res, this.url);
        return this.res
          .status(404, `Invalid or unknown path: ${this.url.pathname}`)
          .send('404 not found', 'text/plain');
      }

      // Router Middleware
      if (router.middlewares.length) {
        const isResponse = await this.executeMiddleware(router.middlewares);
        if (isResponse instanceof Response) return isResponse;
      }

      // Router controller
      return await route.controller(this.req, this.res, this.url);
    } catch (err: Error | any) {
      // Error handler
      const errorHandler = this.app.getErrorHandler();
      if (errorHandler) return await errorHandler(this.req, this.res, this.url);
      return this.res.status(500, `Error: ${err.message}`).send('500 internal server error', 'text/plain');
    }
  }

  private async executeMiddleware(middlewares: Middleware[]): Promise<boolean | Response> {
    for (const method of middlewares) {
      const isResponse = await method(this.req, this.res, this.url);
      if (isResponse instanceof Response) return isResponse;
    }
    return false;
  }
}
