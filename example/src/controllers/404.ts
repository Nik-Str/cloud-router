import { ClientRequest, WorkerResponse } from 'cloud-router-ts';

export default (req: ClientRequest, res: WorkerResponse) => {
	return res.status(404).send('404 Not Found', 'text/plain');
};
