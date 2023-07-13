import { ClientRequest, WorkerResponse } from 'cloud-router';

const userToken = 'JWT';

export default (req: ClientRequest, res: WorkerResponse) => {
	if (!req.cookies || req.cookies.session !== userToken) return res.status(401).send('Invalid or expired session', 'text/plain');
};
