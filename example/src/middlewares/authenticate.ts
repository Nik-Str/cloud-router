import { ClientRequest, WorkerResponse } from 'cloud-router';

const proxySecret = 'MyApiSecret';

export default (req: ClientRequest, res: WorkerResponse) => {
	const proxyKey = req.headers.get('x-special-proxy-header');
	if (!proxyKey || proxyKey !== proxySecret)
		return res.status(401).send('Invalid or missing x-special-proxy-header in request', 'text/plain');
};
