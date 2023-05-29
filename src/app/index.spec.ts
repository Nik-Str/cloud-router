import { App, Router, Res } from '../';

const app = new App();

const authenticate = (req: Request, res: Res) => {};
const middlewareOne = (req: Request, res: Res) => res.status(200).json({ data: 'Awsome' });
const middlewareTwo = (req: Request, res: Res) => res.status(300).redirect('/');
const controller = (req: Request, res: Res) => res.status(404).send('404 not found', 'text/plain');

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
    router.patch('auth/user', controller);
    router.put('auth/user', controller);
    router.option('auth/user', controller);

    app.setRouter('api', router, middlewareOne);
    const appRoutes = app.getRouters();
    expect(appRoutes['api']).toBeDefined();

    expect(appRoutes['api'].routes).toEqual([
      {
        path: 'auth/user',
        method: 'GET',
        controller
      },
      {
        path: 'auth/user',
        method: 'POST',
        controller
      },
      {
        path: 'auth/user',
        method: 'DELETE',
        controller
      },
      {
        path: 'auth/user',
        method: 'PATCH',
        controller
      },
      {
        path: 'auth/user',
        method: 'PUT',
        controller
      },
      {
        path: 'auth/user',
        method: 'OPTION',
        controller
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
        controller
      },
      {
        path: 'messages',
        method: 'POST',
        controller
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
