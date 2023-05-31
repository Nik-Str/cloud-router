export type CookieOptions = {
  maxAge?: number;
  signed?: boolean;
  expires?: Date;
  httpOnly?: boolean;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
};

export default class Res {
  private statusCode = 200;
  private statusText = 'ok';
  private headers: Headers;
  private cookiesOptions: CookieOptions = {
    httpOnly: true,
    domain: '',
    path: '/',
    sameSite: 'none',
    expires: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    secure: true
  };

  constructor(req: Request, headers?: Record<string, string>) {
    this.headers = headers ? new Headers(headers) : new Headers();
    this.cookiesOptions.domain = new URL(req.url).hostname;
  }

  // Response
  private getResponseOptions(): { headers: Headers; status: number; statusText: string } {
    return { headers: this.headers, status: this.statusCode, statusText: this.statusText };
  }

  status(statusCode: number, statusText?: string): Res {
    this.statusCode = statusCode;
    if (statusText) this.statusText = statusText;
    return this;
  }

  json(data: any): Response {
    const body = JSON.stringify(data, null, 2);
    this.headers.append('Content-Type', 'application/json');
    return new Response(body, this.getResponseOptions());
  }

  send(body: BodyInit, contentType: string): Response {
    this.headers.append('Content-Type', contentType);
    return new Response(body, this.getResponseOptions());
  }

  redirect(path: string): Response {
    this.headers.append('Location', path);
    this.headers.append('Cache-Control', 'no-cache');
    this.statusCode = 301;
    return new Response(undefined, this.getResponseOptions());
  }

  pipe(response: Response): Response {
    const { readable, writable } = new TransformStream();
    response.body && response.body.pipeTo(writable);
    return new Response(readable, response);
  }

  // Headers
  setHeaders(headers: Record<string, string>): Res {
    Object.entries(headers).forEach(([key, value]) => this.headers.append(key, value));
    return this;
  }

  setHeader(name: string, value: string): Res {
    this.headers.append(name, value);
    return this;
  }

  clearHeaders(): Res {
    this.headers = new Headers();
    return this;
  }

  clearHeader(name: string): Res {
    this.headers.delete(name);
    return this;
  }

  getHeaders(): Record<string, string> {
    const headers = {} as Record<string, string>;
    this.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }

  getHeader(name: string): string | null {
    return this.headers.get(name);
  }

  // Cookies
  setCookie(name: string, value: string, options: CookieOptions = {}): Res {
    const cookie: string[] = [`${name}=${value};`];
    for (const [key, option] of Object.entries({ ...this.cookiesOptions, ...options })) {
      cookie.push(`${key}=${option};`);
    }
    this.headers.append('Set-Cookie', cookie.join(' '));
    return this;
  }

  clearCookie(name: string): Res {
    this.setCookie(name, '', { expires: new Date(0) });
    return this;
  }
}
