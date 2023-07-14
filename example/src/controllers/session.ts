import { ClientRequest, WorkerResponse } from '../../../build';

type UserCredentials = { email: string; password: string };
const userMock = { email: 'john.doe@gmail.com', password: '12345' };

export const oauth = (req: ClientRequest, res: WorkerResponse) => {
	return res.redirect('callback');
};

export const oauthCallback = (req: ClientRequest, res: WorkerResponse) => {
	res.setCookie('session', 'JWT');
	return res.json({ data: 'ok' });
};

export const logout = (req: ClientRequest, res: WorkerResponse) => {
	res.clearCookie('session');
	return res.json({ data: 'ok' });
};

export const login = (req: ClientRequest<UserCredentials>, res: WorkerResponse) => {
	if (!req.data) return res.status(400).json({ error: 'Invalid or missing properties in request body' });
	const { email, password } = req.data;
	if (userMock.email !== email || userMock.password !== password) return res.status(400).json({ error: 'Invalid user credentials' });
	res.setCookie('session', 'JWT');
	return res.json({ data: 'ok' });
};
