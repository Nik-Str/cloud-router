import Req from '../src/request';

describe('Req class', () => {
  it('Add URL object to request', async () => {
    const request = new Request('http://example.com/api?test=123&param=true');
    const req = new Req(request);
    expect(req._url).toBeInstanceOf(URL);
    expect(req._url.searchParams).toBeInstanceOf(URLSearchParams);
    expect(req._url.searchParams.get('test')).toEqual('123');
    expect(req._url.searchParams.get('param')).toEqual('true');
  });
});
