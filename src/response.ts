/**
 * Options for configuring cookies.
 */
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

/**
 * The WorkerResponse class representing the HTTP response.
 * @example
 * const app = new App()
 * app.authenticate((req: ClientRequest, res: WorkerResponse) => {
 *  if (!req.headers.get("Token"))
 *    return res.status(400).json({ data: 'Unauthorized!' })
 * })
 */
export default class WorkerResponse {
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

  /**
   * Creates an instance of the WorkerResponse class.
   * @param {Request} req - The incoming request.
   * @param {Record<string, string>} headers - Any default response headers.
   */
  constructor(req: Request, headers?: Record<string, string>) {
    this.headers = headers ? new Headers(headers) : new Headers();
    this.cookiesOptions.domain = new URL(req.url).hostname;
  }

  private getResponseOptions(): { headers: Headers; status: number; statusText: string } {
    return { headers: this.headers, status: this.statusCode, statusText: this.statusText };
  }

  /**
   * Sets the status code and status text of the response.
   * @param {number} statusCode - The status code.
   * @param {string} statusText - The status text.
   * @returns {WorkerResponse} The WorkerResponse instance.
   */
  status(statusCode: number, statusText?: string): WorkerResponse {
    this.statusCode = statusCode;
    if (statusText) this.statusText = statusText;
    return this;
  }

  /**
   * Sends a JSON response.
   * @param {any} data - The data to be sent as JSON.
   * @returns {Response} A new Response instance.
   */
  json(data: any): Response {
    const body = JSON.stringify(data, null, 2);
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Content-Length', body.length.toString());
    return new Response(body, this.getResponseOptions());
  }

  /**
   * Sends a response with the provided body and content type.
   * @param {BodyInit} body - The response body.
   * @param {string} contentType - The content type of the response.
   * @returns {Response} A new Response instance.
   */
  send(body?: BodyInit | undefined, contentType?: string): Response {
    if (contentType) this.headers.append('Content-Type', contentType);
    return new Response(body, this.getResponseOptions());
  }

  /**
   * Redirects the response to the specified path.
   * @param {string} path - The path to redirect to.
   * @returns {Response} A new Response instance.
   */
  redirect(path: string): Response {
    this.headers.append('Location', path);
    this.headers.append('Cache-Control', 'no-cache');
    this.statusCode = 301;
    return new Response(undefined, this.getResponseOptions());
  }

  /**
   * Pipes the response to another Response object.
   * @param {Response} response - The response to pipe to.
   * @returns {Response} A new Response instance.
   */
  pipe(response: Response): Response {
    const { readable, writable } = new TransformStream();
    response.body && response.body.pipeTo(writable);
    return new Response(readable, response);
  }

  /**
   * Sets multiple headers in the response.
   * @param {Record<string, string>} headers - The headers to set.
   * @returns {WorkerResponse} The WorkerResponse instance.
   */
  setHeaders(headers: Record<string, string>): WorkerResponse {
    Object.entries(headers).forEach(([key, value]) => this.headers.append(key, value));
    return this;
  }

  /**
   * Sets a single header in the response.
   * @param {string} name - The name of the header.
   * @param {string} value - The value of the header.
   * @returns {WorkerResponse} The WorkerResponse instance.
   */
  setHeader(name: string, value: string): WorkerResponse {
    this.headers.append(name, value);
    return this;
  }

  /**
   * Clears all headers in the response.
   * @returns {WorkerResponse} The WorkerResponse instance.
   */
  clearHeaders(): WorkerResponse {
    this.headers = new Headers();
    return this;
  }

  /**
   * Clears a specific header in the response.
   * @param {string} name - The name of the header to clear.
   * @returns {WorkerResponse} The WorkerResponse instance.
   */
  clearHeader(name: string): WorkerResponse {
    this.headers.delete(name);
    return this;
  }

  /**
   * Retrieves all headers in the response.
   * @returns {Record<string, string>} An object representing the headers.
   */
  getHeaders(): Record<string, string> {
    const headers = {} as Record<string, string>;
    this.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }

  /**
   * Retrieves the value of a specific header.
   * @param {string} name - The name of the header.
   * @returns {string | null} The value of the header, or null if not found.
   */
  getHeader(name: string): string | null {
    return this.headers.get(name);
  }

  /**
   * Sets a cookie in the response.
   * @param {string} name - The name of the cookie.
   * @param {string} value - The value of the cookie.
   * @param {CookieOptions} options - The options for the cookie.
   * @returns {WorkerResponse} The WorkerResponse instance.
   */
  setCookie(name: string, value: string, options: CookieOptions = {}): WorkerResponse {
    const cookie: string[] = [`${name}=${value};`];
    for (const [key, option] of Object.entries({ ...this.cookiesOptions, ...options })) {
      cookie.push(`${key}=${option};`);
    }
    this.headers.append('Set-Cookie', cookie.join(' '));
    return this;
  }

  /**
   * Clears a cookie in the response.
   * @param {string} name - The name of the cookie to clear.
   * @returns {WorkerResponse} The WorkerResponse instance.
   */
  clearCookie(name: string): WorkerResponse {
    this.setCookie(name, '', { expires: new Date(0) });
    return this;
  }
}
