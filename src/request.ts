/**
 * The ClientRequest class, extends the Request object.
 * @example
 * const app = new App()
 * app.authenticate((req: ClientRequest, res: WorkerResponse) => {
 *  if (!req.param.id && !req._url.searchParams.get('id'))
 *    return res.status(400).json({ data: 'Unauthorized!' })
 * })
 */
class ClientRequest<Data = undefined, Param = Record<string, never>> extends Request {
  [key: string]: any;
  param: Param | Record<string, string> = {};
  _url: URL;
  data: Data | undefined;
  error: Error | undefined;

  /**
   * Creates an instance of the ClientRequest class.
   * @param {Request} request - The incoming HTTP request.
   */
  constructor(request: Request) {
    super(request.url, request);
    this._url = new URL(request.url);
  }
}

export default ClientRequest;
