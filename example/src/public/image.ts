import { ClientRequest, WorkerResponse } from 'cloud-router-ts';

export default async (req: ClientRequest, res: WorkerResponse) => {
	const fileName = req._url.pathname.split('/').pop();
	const response = await fetch(`https://pathToMyBucket/${fileName}`);
	return res.pipe(response);
};
