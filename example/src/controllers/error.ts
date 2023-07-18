import { ClientRequest, WorkerResponse } from 'cloud-router-ts';

export default (req: ClientRequest, res: WorkerResponse) => {
	console.error(req.error);
	return res.status(500).send('500 internal server error', 'text/plain');
};
