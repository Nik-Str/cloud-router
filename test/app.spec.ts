import WorkerResponse from '../src/response';
import App, { Router } from '../src/app';
import ClientRequest from '../src/request';

const app = new App();

const authenticate = () => {};
const middlewareOne = (req: ClientRequest, res: WorkerResponse) => res.status(200).json({ data: 'Awsome' });
const middlewareTwo = (req: ClientRequest, res: WorkerResponse) => res.status(300).redirect('/');
const controller = (req: ClientRequest, res: WorkerResponse) => res.status(404).send('404 not found', 'text/plain');

describe('App/Router class', () => {
  it('Register app authentication', () => {
    app.authenticate(authenticate);
    expect(app.getAuthHandler()).toEqual(authenticate);
  });

  it('Register app public routes', () => {
    app.public('image', controller);
    expect(app.getPublicRoutes()).toEqual({ image: controller });

    app.public('js', controller);
    expect(app.getPublicRoutes()).toEqual({ image: controller, js: controller });
  });

  it('Register app middlewares', () => {
    app.middleware(middlewareOne, middlewareTwo);
    expect(app.getMiddlewares()).toEqual([middlewareOne, middlewareTwo]);
  });

  it('Register router with middleware', () => {
    const router = new Router();
    router.get('auth/user', controller);
    router.post('auth/user', controller);
    router.delete('auth/user', controller);
    router.patch('auth/:id', controller);
    router.put('auth/user', controller);
    router.option('auth/:type', controller);

    app.setRouter('api', router, middlewareOne);
    const appRoutes = app.getRouters();
    expect(appRoutes['api']).toBeDefined();

    expect(appRoutes['api'].routes).toEqual([
      {
        path: 'auth/user',
        method: 'GET',
        controller,
        param: false
      },
      {
        path: 'auth/user',
        method: 'POST',
        controller,
        param: false
      },
      {
        path: 'auth/user',
        method: 'DELETE',
        controller,
        param: false
      },
      {
        path: 'auth/:id',
        method: 'PATCH',
        controller,
        param: true
      },
      {
        path: 'auth/user',
        method: 'PUT',
        controller,
        param: false
      },
      {
        path: 'auth/:type',
        method: 'OPTION',
        controller,
        param: true
      }
    ]);
    expect(appRoutes['api'].middlewares).toEqual([middlewareOne]);
  });

  it('Register router without middleware', () => {
    const router = new Router();
    router.get('messages', controller);
    router.post('messages', controller);

    app.setRouter('chatt', router);
    const appRoutes = app.getRouters();
    expect(appRoutes['chatt']).toBeDefined();

    expect(appRoutes['chatt'].routes).toEqual([
      {
        path: 'messages',
        method: 'GET',
        controller,
        param: false
      },
      {
        path: 'messages',
        method: 'POST',
        controller,
        param: false
      }
    ]);
    expect(appRoutes['chatt'].middlewares).toEqual([]);
  });

  it('Register app not found handler', () => {
    app.notFound(controller);
    expect(app.getNotFoundHandler()).toEqual(controller);
  });

  it('Register app error handler', () => {
    app.error(controller);
    expect(app.getErrorHandler()).toEqual(controller);
  });
});
