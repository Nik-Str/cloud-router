import { Res, Req } from '../';

export type Middleware = (req: Req, res: Res) => void | Promise<any | Response> | Response | Error;
export type Controller = (req: Req, res: Res) => Response | Promise<Response>;
export type Methods = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTION' | 'HEAD';
export type Public = Record<string, Controller>;
export type Route = { path: string; method: Methods; controller: Controller; param: boolean };
export type Routes = {
  middlewares: Middleware[] | [];
  routes: Route[];
};
export type Routers = {
  [key: string]: Routes;
};

export class App {
  private routers: Routers = {};
  private middlewares: Middleware[] = [];
  private publicRoutes: Public = {};
  private authHandler?: Middleware;
  private notFoundHandler?: Controller;
  private errorHandler?: Controller;

  public authenticate(middleware: Middleware) {
    this.authHandler = middleware;
  }

  public public(path: string, handler: Controller) {
    this.publicRoutes[path] = handler;
  }

  public middleware(...middlewares: Middleware[]) {
    this.middlewares = middlewares;
  }

  public setRouter(path: string, { routes }: Router, ...middlewares: Middleware[]) {
    this.routers[path] = {
      middlewares,
      routes
    };
  }

  public error(controller: Controller) {
    this.errorHandler = controller;
  }

  public notFound(controller: Controller) {
    this.notFoundHandler = controller;
  }

  public getRouters(): Routers {
    return this.routers;
  }

  public getMiddlewares(): Middleware[] | [] {
    return this.middlewares;
  }

  public getPublicRoutes(): Public {
    return this.publicRoutes;
  }

  public getAuthHandler(): Middleware | undefined {
    return this.authHandler;
  }

  public getErrorHandler(): Controller | undefined {
    return this.errorHandler;
  }

  public getNotFoundHandler(): Controller | undefined {
    return this.notFoundHandler;
  }
}

export class Router {
  routes: Route[] = [];
  post(path: string, controller: Controller) {
    this.routes.push({ path, method: 'POST', controller, param: /\/:[\w\d]+/.test(path) });
  }
  get(path: string, controller: Controller) {
    this.routes.push({ path, method: 'GET', controller, param: /\/:[\w\d]+/.test(path) });
  }
  put(path: string, controller: Controller) {
    this.routes.push({ path, method: 'PUT', controller, param: /\/:[\w\d]+/.test(path) });
  }
  delete(path: string, controller: Controller) {
    this.routes.push({ path, method: 'DELETE', controller, param: /\/:[\w\d]+/.test(path) });
  }
  patch(path: string, controller: Controller) {
    this.routes.push({ path, method: 'PATCH', controller, param: /\/:[\w\d]+/.test(path) });
  }
  option(path: string, controller: Controller) {
    this.routes.push({ path, method: 'OPTION', controller, param: /\/:[\w\d]+/.test(path) });
  }
  head(path: string, controller: Controller) {
    this.routes.push({ path, method: 'HEAD', controller, param: /\/:[\w\d]+/.test(path) });
  }
}
// addera ytterligare en prop till Route interface (param: boolean)
// // param: /\/:[\w\d]+/.test(path)
// Sen när vi testar route i worker, har vi även denna att kolla mot innan vi testar för enkel "/"
