import ClientRequest from './request';
import WorkerResponse from './response';

/**
 * Represents a middleware function.
 * @param {ClientRequest} req - The ClientRequest class extends Request.
 * @param {WorkerResponse} res - The WorkerResponse class representing the http response.
 * @returns {void | Response | Error | any | Promise<Response | Error | any | void>} The result of the middleware execution.
 */
export type Middleware = (
  req: ClientRequest,
  res: WorkerResponse
) => void | Response | Error | any | Promise<Response | Error | any | void>;

/**
 * Represents a controller function.
 * @param {ClientRequest} req - The ClientRequest class extends Request.
 * @param {WorkerResponse} res - The WorkerResponse class representing the http response.
 * @returns {Response | Error | Promise<Response | Error>} The response object.
 */
export type Controller = (req: ClientRequest, res: WorkerResponse) => Response | Promise<Response>;

/**
 * Represents http methods.
 */
export type Methods = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTION' | 'HEAD';

/**
 * Represents a public route configuration.
 */
export type Public = Record<string, Controller>;

/**
 * Represents a route definition.
 */
export type Route = { path: string; method: Methods; controller: Controller; param: boolean };

/**
 * Represents a collection of routes and middlewares.
 */
export type Routes = {
  middlewares: Middleware[] | [];
  routes: Route[];
};

/**
 * Represents a collection of routers.
 */
export type Routers = {
  [key: string]: Routes;
};

/**
 * The App class, holds information about application routing, middleware and controllers.
 * @example
 * const app = new App();
 * app.authenticate(middleware)
 * app.public('image', controller)
 * app.middleware(middleware, middleware)
 * app.setRouter('api', router, middleware, middleware)
 * app.error(controller)
 * app.notFound(controller)
 */
export default class App {
  private routers: Routers = {};
  private middlewares: Middleware[] = [];
  private publicRoutes: Public = {};
  private authHandler?: Middleware;
  private notFoundHandler?: Controller;
  private errorHandler?: Controller;

  /**
   * Sets the authentication middleware for the application. This callback will be executed first on every request, before any other middlewares or controllers.
   * @param {Middleware} middleware - The authentication middleware.
   */
  authenticate(middleware: Middleware) {
    this.authHandler = middleware;
  }

  /**
   * Adds a public route to the application. Public routes are executed before any App middlewares, but after Authentication middleware.
   * @param {string} path - The route base path.
   * @param {Controller} controller - The route controller.
   */
  public(path: string, controller: Controller) {
    this.publicRoutes[path] = controller;
  }

  /**
   * Adds middlewares to the application.
   * @param {...Middleware} middlewares - The middlewares to be added.
   */
  middleware(...middlewares: Middleware[]) {
    this.middlewares = middlewares;
  }

  /**
   * Adds a new router to the application
   * @param {string} path - The router path.
   * @param {Router} router - The router instance.
   * @param {...Middleware} middlewares - The middlewares to be added to the router.
   */
  setRouter(path: string, { routes }: Router, ...middlewares: Middleware[]) {
    this.routers[path] = {
      middlewares,
      routes
    };
  }

  /**
   * Sets the error handler for the application. This callback will be executed if any error occurs within the application outside lower level try/catch block.
   * @param {Controller} controller - The error handler controller.
   */
  error(controller: Controller) {
    this.errorHandler = controller;
  }

  /**
   * Sets the not found handler for the application. This callback will be executed if the path of the incoming request has no corresponding router registered within the application.
   * @param {Controller} controller - The not found handler controller.
   */
  notFound(controller: Controller) {
    this.notFoundHandler = controller;
  }

  /**
   * Gets the registered routers.
   * @returns {Routers} The registered routers.
   */
  getRouters(): Routers {
    return this.routers;
  }

  /**
   * Gets the registered middlewares.
   * @returns {Middleware[] | []} The registered middlewares.
   */
  getMiddlewares(): Middleware[] | [] {
    return this.middlewares;
  }

  /**
   * Gets the registered public routes.
   * @returns {Public} The registered public routes.
   */
  getPublicRoutes(): Public {
    return this.publicRoutes;
  }

  /**
   * Gets the authentication middleware.
   * @returns {Middleware | undefined} The authentication middleware.
   */
  getAuthHandler(): Middleware | undefined {
    return this.authHandler;
  }

  /**
   * Gets the error handler.
   * @returns {Controller | undefined} The error handler.
   */
  getErrorHandler(): Controller | undefined {
    return this.errorHandler;
  }

  /**
   * Gets the not found handler.
   * @returns {Controller | undefined} The not found handler.
   */
  getNotFoundHandler(): Controller | undefined {
    return this.notFoundHandler;
  }
}

/**
 * The Router class, represents a router with route registration methods.
 * @example
 * const router = new Router(request);
 * router.get('user', (req, res) => {})
 * router.get('user/:id', (req, res) => {})
 * router.post('/', (req, res) => {})
 */
export class Router {
  routes: Route[] = [];
  /**
   * Registers a route with the POST http method.
   * @param {string} path - The route path.
   * @param {Controller} controller - The route controller.
   */
  post(path: string, controller: Controller) {
    this.routes.push({ path, method: 'POST', controller, param: /\/:[\w\d]+/.test(path) });
  }

  /**
   * Registers a route with the GET http method.
   * @param {string} path - The route path.
   * @param {Controller} controller - The route controller.
   */
  get(path: string, controller: Controller) {
    this.routes.push({ path, method: 'GET', controller, param: /\/:[\w\d]+/.test(path) });
  }

  /**
   * Registers a route with the PUT http method.
   * @param {string} path - The route path.
   * @param {Controller} controller - The route controller.
   */
  put(path: string, controller: Controller) {
    this.routes.push({ path, method: 'PUT', controller, param: /\/:[\w\d]+/.test(path) });
  }

  /**
   * Registers a route with the DELETE http method.
   * @param {string} path - The route path.
   * @param {Controller} controller - The route controller.
   */
  delete(path: string, controller: Controller) {
    this.routes.push({ path, method: 'DELETE', controller, param: /\/:[\w\d]+/.test(path) });
  }

  /**
   * Registers a route with the PATCH http method.
   * @param {string} path - The route path.
   * @param {Controller} controller - The route controller.
   */
  patch(path: string, controller: Controller) {
    this.routes.push({ path, method: 'PATCH', controller, param: /\/:[\w\d]+/.test(path) });
  }

  /**
   * Registers a route with the OPTION http method.
   * @param {string} path - The route path.
   * @param {Controller} controller - The route controller.
   */
  option(path: string, controller: Controller) {
    this.routes.push({ path, method: 'OPTION', controller, param: /\/:[\w\d]+/.test(path) });
  }

  /**
   * Registers a route with the HEAD http method.
   * @param {string} path - The route path.
   * @param {Controller} controller - The route controller.
   */
  head(path: string, controller: Controller) {
    this.routes.push({ path, method: 'HEAD', controller, param: /\/:[\w\d]+/.test(path) });
  }
}
