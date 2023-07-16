import { ClientRequest, WorkerResponse } from '@ts-worker/cloud-router';

export default (req: ClientRequest, res: WorkerResponse) => {
	return res.status(404).send('404 Not Found', 'text/plain');
};
