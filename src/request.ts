class Req extends Request {
  [key: string]: any;
  param: Record<string, string> = {};
  _url: URL;

  constructor(request: Request) {
    super(request.url, request);
    this._url = new URL(request.url);
  }
}

export default Req;
