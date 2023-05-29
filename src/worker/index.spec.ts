import { Res, Req, Worker, App, Router } from '..';

let i = 0;
const authenticate = (req: Req, res: Res, url: URL) => {
  if (url.searchParams.has('abort')) return res.status(400).json({ data: 'aborted' });
};
const publicRoute = (req: Req, res: Res) => res.status(200).json({ data: 'Public' });
const middlewareA = (req: Req) =>
  new Promise((resolve) => {
    setTimeout(() => {
      req.testA = i++;
      resolve(null);
    }, 500);
  });
const middlewareB = (req: Req, res: Res, url: URL) => {
  if (url.searchParams.has('failed')) return res.status(406).json({ data: 'failed' });
  req.testB = i++;
};
const middlewareC = (req: Req, res: Res, url: URL) =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (url.searchParams.has('invalid')) {
        const response = res.status(401).json({ data: 'invalid' });
        return resolve(response);
      }
      req.testC = i++;
      resolve(null);
    }, 1000);
  });
const middlewareD = (req: Req) => {
  req.testD = i++;
};
const middlewareError = (req: Req, res: Res, url: URL) => {
  if (url.searchParams.has('error')) throw new Error('123');
};
const controllerA = (req: Req, res: Res) => res.status(200).json({ data: 'A' });
const controllerB = (req: Req, res: Res) => res.status(200).json({ data: 'B' });
const controllerC = (req: Req, res: Res) => res.status(200).json({ data: 'C' });
const controllerD = (req: Req, res: Res) => res.status(200).json({ data: 'D' });
const controllerE = (req: Req, res: Res) => res.status(200).json({ data: 'E' });
const controllerF = (req: Req, res: Res) =>
  res.status(200).json({ a: req.testA, b: req.testB, c: req.testC, d: req.testD });
const controllerError = () => {
  throw new Error('123');
};
const notFound = (req: Req, res: Res) => res.status(404).json({ data: '404' });
const error = (req: Req, res: Res) => res.status(500).json({ data: '500' });

const routerA = new Router();
routerA.get('/', controllerA);
routerA.post('/', controllerB);
routerA.get('test', controllerC);
routerA.get('test/two', controllerD);
routerA.get('test/error', controllerError);

const routerB = new Router();
routerB.get('test', controllerE);
routerB.get('test/midd', controllerF);

const baseHeaders = {
  'Access-Control-Allow-baseHeaders': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '3600'
};

const app = new App();
app.authenticate(authenticate);
app.public('image', publicRoute);
app.middleware(middlewareA, middlewareB, middlewareError);
app.setRouter('base', routerA);
app.setRouter('api', routerB, middlewareC, middlewareD);
app.notFound(notFound);
app.error(error);

describe('Server class', () => {
  it('Listen and return response', async () => {
    const req = new Request('https://server.com/base');
    const worker = new Worker(req, app, baseHeaders);

    const res = await worker.listen();
    expect(res).toBeInstanceOf(Response);
    expect(await res.json()).toEqual({ data: 'A' });
  });

  it('Routes correct by path and method', async () => {
    const reqB = new Request('https://server.com/base', {
      method: 'POST'
    });
    const reqC = new Request('https://server.com/base/test');
    const reqD = new Request('https://server.com/base/test/two');
    const workerB = new Worker(reqB, app, baseHeaders);
    const workerC = new Worker(reqC, app, baseHeaders);
    const workerD = new Worker(reqD, app, baseHeaders);

    const resB = await workerB.listen();
    expect(await resB.json()).toEqual({ data: 'B' });
    const resC = await workerC.listen();
    expect(await resC.json()).toEqual({ data: 'C' });
    const resD = await workerD.listen();
    expect(await resD.json()).toEqual({ data: 'D' });
  });

  it('Handle multiple base routes', async () => {
    const req = new Request('https://server.com/api/test');
    const worker = new Worker(req, app, baseHeaders);

    const res = await worker.listen();
    expect(await res.json()).toEqual({ data: 'E' });
  });

  it('Execute async and sync app and router middleware in order', async () => {
    const req = new Request('https://server.com/api/test/midd');
    const worker = new Worker(req, app, baseHeaders);

    const resE = await worker.listen();
    const { a, b, c, d } = (await resE.json()) as any;
    expect(a).toBeDefined();
    expect(b).toBeDefined();
    expect(c).toBeDefined();
    expect(d).toBeDefined();
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
    expect(c).toBeLessThan(d);
  });

  it('Handle early abortion response in auth', async () => {
    i = 0;
    const req = new Request('https://server.com/api/test/midd?abort=true');
    const worker = new Worker(req, app, baseHeaders);

    const res = await worker.listen();
    const data = (await res.json()) as any;
    expect(res.status).toBe(400);
    expect(data).toEqual({ data: 'aborted' });
    expect(i).toBe(0);
  });

  it('Handle early abortion response in app middleware', async () => {
    i = 0;
    const req = new Request('https://server.com/api/test/midd?failed=true');
    const worker = new Worker(req, app, baseHeaders);

    const res = await worker.listen();
    const data = (await res.json()) as any;
    expect(res.status).toBe(406);
    expect(data).toEqual({ data: 'failed' });
    expect(i).toBe(1);
  });

  it('Handle early abortion response in router middleware', async () => {
    i = 0;
    const req = new Request('https://server.com/api/test/midd?invalid=true');
    const server = new Worker(req, app, baseHeaders);

    const res = await server.listen();
    const data = (await res.json()) as any;
    expect(res.status).toBe(401);
    expect(data).toEqual({ data: 'invalid' });
    expect(i).toBe(2);
  });

  it('Handle public routes', async () => {
    i = 0;
    const req = new Request('https://server.com/image/some123random456id');
    const worker = new Worker(req, app, baseHeaders);

    const res = await worker.listen();
    const data = (await res.json()) as any;
    expect(res.status).toBe(200);
    expect(data).toEqual({ data: 'Public' });
    expect(i).toBe(0);
  });

  it('Handles 404 not found response', async () => {
    i = 0;
    const req = new Request('https://server.com/notfound/123');
    const worker = new Worker(req, app, baseHeaders);

    const res = await worker.listen();
    const data = (await res.json()) as any;
    expect(res.status).toBe(404);
    expect(data).toEqual({ data: '404' });
  });

  it('Handles 500 response on error in controller', async () => {
    i = 0;
    const req = new Request('https://server.com/base/test/error');
    const worker = new Worker(req, app, baseHeaders);

    const res = await worker.listen();
    const data = (await res.json()) as any;
    expect(res.status).toBe(500);
    expect(data).toEqual({ data: '500' });
  });

  it('Handles 500 response on error in middleware', async () => {
    i = 0;
    const req = new Request('https://server.com/base/test/error?error=true');
    const worker = new Worker(req, app, baseHeaders);

    const res = await worker.listen();
    const data = (await res.json()) as any;
    expect(res.status).toBe(500);
    expect(data).toEqual({ data: '500' });
  });
});
