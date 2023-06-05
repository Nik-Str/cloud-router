/**
 * The Req class, extends the Request object.
 * @example
 * const app = new App()
 * app.authenticate((req, res) => {
 *  if (!req.param.id && !req._url.searchParams.get('id'))
 *    return res.status(400).json({ data: 'Unauthorized!' })
 * })
 */
class Req extends Request {
  [key: string]: any;
  param: Record<string, string> = {};
  _url: URL;

  /**
   * Creates an instance of the Req class.
   * @param {Request} request - The incoming request.
   */
  constructor(request: Request) {
    super(request.url, request);
    this._url = new URL(request.url);
  }
}

export default Req;
