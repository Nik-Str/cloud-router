import { ClientRequest, Router, WorkerResponse } from 'cloud-router';

const router = new Router();

type UserCredentials = { email: string; password: string };
const userMock = { email: 'john.doe@gmail.com', password: '12345' };

router.get('oauth', (req: ClientRequest, res: WorkerResponse) => {
	return res.redirect('callback');
});

router.get('callback', (req: ClientRequest, res: WorkerResponse) => {
	res.setCookie('session', 'JWT');
	return res.json({ data: 'ok' });
});

router.get('logout', (req: ClientRequest, res: WorkerResponse) => {
	res.clearCookie('session');
	return res.json({ data: 'ok' });
});

router.post('login', (req: ClientRequest<UserCredentials>, res: WorkerResponse) => {
	if (!req.data) return res.status(400).json({ error: 'Invalid or missing properties in request body' });
	const { email, password } = req.data;
	if (userMock.email !== email || userMock.password !== password) return res.status(400).json({ error: 'Invalid user credentials' });
	res.setCookie('session', 'JWT');
	return res.json({ data: 'ok' });
});

export default router;
