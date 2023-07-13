import { ClientRequest, Router, WorkerResponse } from 'cloud-router';

const router = new Router();

const id = () => Math.floor(Math.random() * 1000).toString();

type User = { firstName: string; lastName: string };

const usersMock = [
	{ id: id(), firstName: 'John', lastName: 'Doe' },
	{ id: id(), firstName: 'Alice', lastName: 'Smith' },
];

router.get('/', (req: ClientRequest, res: WorkerResponse) => {
	return res.json({ data: usersMock });
});

router.get('search', (req: ClientRequest, res: WorkerResponse) => {
	const firstName = req._url.searchParams.get('firstName');
	const lastName = req._url.searchParams.get('lastName');
	const data = usersMock.filter((user) => user.firstName === firstName || user.lastName === lastName);
	return res.json({ data });
});

router.get('/:id', (req: ClientRequest<undefined, { id: string }>, res: WorkerResponse) => {
	const id = req.param.id;
	const data = usersMock.find((user) => user.id === id);
	return res.json({ data });
});

router.post('/', (req: ClientRequest<User>, res: WorkerResponse) => {
	if (!req.data) return res.status(400).json({ error: 'Missing body in request' });
	usersMock.push({ id: id(), ...req.data });
	return res.status(201).json({ data: usersMock });
});

router.patch('lastName/:id', (req: ClientRequest<User>, res: WorkerResponse) => {
	if (!req.data) return res.status(400).json({ error: 'Missing body in request' });
	for (let i = 0; i < usersMock.length; i++) {
		if (usersMock[i].id === req.param.id) usersMock[i].lastName = req.data.lastName;
	}
	return res.status(201).json({ data: usersMock });
});

router.put('/:id', (req: ClientRequest<User>, res: WorkerResponse) => {
	if (!req.data) return res.status(400).json({ error: 'Missing body in request' });
	for (let i = 0; i < usersMock.length; i++) {
		if (usersMock[i].id === req.param.id) usersMock[i] = { id: usersMock[i].id, ...req.data };
	}
	return res.status(201).json({ data: usersMock });
});

router.delete('/:id', (req: ClientRequest<User>, res: WorkerResponse) => {
	const index = usersMock.findIndex((user) => user.id === req.param.id);
	usersMock.splice(index, 1);
	return res.json({ data: usersMock });
});

export default router;
