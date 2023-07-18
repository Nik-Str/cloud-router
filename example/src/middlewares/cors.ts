import { ClientRequest, WorkerResponse } from 'cloud-router-ts';

export default (req: ClientRequest, res: WorkerResponse) => {
	res.setHeaders({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Credentials': 'true',
		'Access-Control-Allow-Methods': '*',
		'Access-Control-Allow-Headers': '*',
	});
	if (req.method === 'OPTIONS') return res.setHeader('Access-Control-Max-Age', '3600').send();
};
