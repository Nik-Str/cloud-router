import ServerResponse from '../src/response';

const baseHeaders = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '3600'
};

const headers = new Headers();
headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; rv:85.0) Gecko/20100101 Firefox/85.0');
headers.append('Accept-Language', 'en-US,en;q=0.5');

const req = new Request('https://test.com', {
  method: 'GET',
  headers,
  credentials: 'include'
});

let res: ServerResponse;
beforeEach(() => {
  res = new ServerResponse(req, baseHeaders);
});

describe('Res class', () => {
  it('Status code and text', () => {
    const response = res.status(500, 'Unknown error').send('Error', 'text/plain');
    expect(response.status).toEqual(500);
    expect(response.statusText).toBe('Unknown error');
  });

  it('Json', async () => {
    const body = { data: { msg: 'awsome' } };
    const response = res.status(200).json(body);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(body);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('Content-Length')).toBe(JSON.stringify(body, null, 2).length.toString());
  });

  it('Send', async () => {
    const response = res.status(201).send('Test', 'text/plain');
    expect(response.status).toBe(201);
    expect(await response.text()).toBe('Test');
    expect(response.headers.get('Content-Type')).toBe('text/plain');
  });

  it('Redirect', async () => {
    const url = 'https://redirected.com';
    const response = res.redirect(url);
    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe(url);
  });

  it('Stream', async () => {
    const response = new Response(JSON.stringify({ msg: 'Hello world!' }));
    const result = res.pipe(response);
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(ReadableStream);
    const body = await result.json();
    expect(body).toEqual({ msg: 'Hello world!' });
  });

  it('Set, get and clear single header', () => {
    res.setHeader('Content-Type', 'text/html');
    expect(res.getHeader('Content-Type')).toBe('text/html');
    res.clearHeader('Content-Type');
    expect(res.getHeader('Content-Type')).toBeNull();
  });

  it('Set, get and clear multiple headers', () => {
    const headersJson = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Length': '10'
    };
    res.setHeaders(headersJson);

    expect(res.getHeaders()).toEqual(
      Object.fromEntries(
        Object.entries({ ...headersJson, ...baseHeaders }).map(([oldKey, value]) => [oldKey.toLowerCase(), value])
      )
    );

    res.clearHeaders();
    expect(res.getHeaders()).toEqual({});
  });

  it('Set cookies with default and custom settings', () => {
    const expires = new Date(new Date().setDate(new Date().getDate() + 1));
    const cookie1 = `Hello=World; httpOnly=true; domain=test.com; path=/; sameSite=none; expires=${expires}; secure=true;`;
    const cookie2 = `Hello=Cloudflare; httpOnly=true; domain=https://test.com; path=/; sameSite=strict; expires=${expires}; secure=true;`;

    res.setCookie('Hello', 'World', { expires });
    expect(res.getHeader('Set-Cookie')).toEqual(cookie1);

    res.setCookie('Hello', 'Cloudflare', { expires, domain: 'https://test.com', sameSite: 'strict' });
    expect(res.getHeader('Set-Cookie')).toEqual(`${cookie1}, ${cookie2}`);
  });

  it('Clear and update cookies', () => {
    const cookie1 = `Test1=; httpOnly=true; domain=test.com; path=/; sameSite=none; expires=${new Date(
      0
    )}; secure=true;`;
    const cookie2 = `Test2=; httpOnly=true; domain=test.com; path=/; sameSite=none; expires=${new Date(
      0
    )}; secure=true;`;

    const response = res.clearCookie('Test1');
    expect(response.getHeader('Set-Cookie')).toBe(cookie1);

    res.clearCookie('Test2');
    expect(response.getHeader('Set-Cookie')).toBe(`${cookie1}, ${cookie2}`);
  });
});
