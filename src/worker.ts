import Req from './request';
import Res from './response';
import App, { Middleware, Route, Routes } from './app';

/**
 * The Worker class, handles the App class instance execution.
 * @example
 * export default {
 *  async fetch(request) {
 *    const app = new App();
 *    app.setRouter('api', (req, res) => {})
 *    const cors = { 'Access-Control-Allow-Methods': '*' }
 *    const worker = new Worker(request, app, cors)
 *    return await worker.listen()
 *  }
 * }
 */
export default class Worker {
  req: Req;
  res: Res;

  /**
   * Creates an instance of the Worker class.
   * @param {Request} req - The incoming request.
   * @param {App} app - The App class object, including all the routes, middlewares and controllers of the application.
   * @param {Record<string, string>} [headers] - Any default headers, that will be added to each response.
   */
  constructor(req: Request, public app: App, headers?: Record<string, string>) {
    this.req = new Req(req);
    this.res = new Res(req, headers);
  }

  /**
   * Initializes your worker and handles incoming request by executing the registered controllers and middlewares.
   * @returns {Promise<Response>} A Promise with the Response
   */
  public async listen(): Promise<Response> {
    try {
      // Authenticate
      const authHandler = this.app.getAuthHandler();
      if (authHandler) {
        const isResponse = await authHandler(this.req, this.res);
        if (isResponse instanceof Response) return isResponse;
      }

      // Public
      const path = this.req._url.pathname.split('/').filter((string: string) => string);
      const publicRoutes = this.app.getPublicRoutes();
      const publicHandler = publicRoutes[path[0]];
      if (publicHandler) return await publicHandler(this.req, this.res);

      // Middleware
      const appMiddlewares = this.app.getMiddlewares();
      if (appMiddlewares.length) {
        const isResponse = await this.executeMiddleware(appMiddlewares);
        if (isResponse instanceof Response) return isResponse;
      }

      const router = this.app.getRouters()[path[0]];
      const route = this.getRoute(router, path);

      // Not found
      if (!router || !route) {
        const notFound = this.app.getNotFoundHandler();
        if (notFound) return await notFound(this.req, this.res);
        return this.res
          .status(404, `Invalid or unknown path: ${this.req._url.pathname}`)
          .send('404 not found', 'text/plain');
      }

      // Param
      if (route.param) {
        const ref = route.path.split(':').pop();
        const param = path.pop();
        if (ref && param) this.req.param[ref] = param;
      }

      // Router Middleware
      if (router.middlewares.length) {
        const isResponse = await this.executeMiddleware(router.middlewares);
        if (isResponse instanceof Response) return isResponse;
      }

      // Router controller
      return await route.controller(this.req, this.res);
    } catch (err: Error | any) {
      // Error handler
      const errorHandler = this.app.getErrorHandler();
      if (errorHandler) return await errorHandler(this.req, this.res);
      return this.res.status(500, `Error: ${err.message}`).send('500 internal server error', 'text/plain');
    }
  }

  private getRoute(router: Routes, path: string[]): Route | null {
    return router?.routes.filter((_route) => {
      if (_route.param)
        return (
          _route.path.split(':')[0] === (`${path.slice(1, -1).join('/')}/` || '/') && _route.method === this.req.method
        );
      return _route.path === (path.slice(1).join('/') || '/') && _route.method === this.req.method;
    })[0];
  }

  private async executeMiddleware(middlewares: Middleware[]): Promise<boolean | Response> {
    for (const method of middlewares) {
      const isResponse = await method(this.req, this.res);
      if (isResponse instanceof Response) return isResponse;
    }
    return false;
  }
}
