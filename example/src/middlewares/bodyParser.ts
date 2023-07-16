import { ClientRequest, WorkerResponse } from '@ts-worker/cloud-router';

export default async (req: ClientRequest, res: WorkerResponse) => {
	if (req.headers.get('Content-Type') === 'application/json' && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method))
		req.data = await req.json();
};
