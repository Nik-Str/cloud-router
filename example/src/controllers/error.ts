import { ClientRequest, WorkerResponse } from '@ts-worker/cloud-router';

export default (req: ClientRequest, res: WorkerResponse) => {
	console.error(req.error);
	return res.status(500).send('500 internal server error', 'text/plain');
};
