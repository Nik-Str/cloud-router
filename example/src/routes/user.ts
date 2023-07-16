import { Router } from '@ts-worker/cloud-router';
import { getUsers, getUserById, searchUser, updateUserLastName, replaceUserInfo, deleteUser, createUser } from '../controllers/user';

const router = new Router();

router.get('/', getUsers);
router.get('search', searchUser);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('lastName/:id', updateUserLastName);
router.put('/:id', replaceUserInfo);
router.delete('/:id', deleteUser);

export default router;
