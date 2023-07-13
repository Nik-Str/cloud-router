import { ClientRequest, WorkerResponse } from 'cloud-router';

export default (req: ClientRequest, res: WorkerResponse) => {
	return res.status(500).send('500 internal server error', 'text/plain');
};
