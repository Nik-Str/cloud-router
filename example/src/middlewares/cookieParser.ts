import { ClientRequest, WorkerResponse } from '@ts-worker/cloud-router';

export default (req: ClientRequest, res: WorkerResponse) => {
	const cookies = req.headers.get('cookie');
	if (cookies) {
		req.cookies = {};
		cookies.split(';').forEach((cookie) => {
			const [key, value] = cookie.split('=');
			req.cookies[key.trim()] = value;
		});
	}
};
