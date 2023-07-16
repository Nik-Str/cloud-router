import { Router } from '@ts-worker/cloud-router';
import { login, logout, oauth, oauthCallback } from '../controllers/session';

const router = new Router();

router.get('oauth', oauth);
router.get('callback', oauthCallback);
router.get('logout', logout);
router.post('login', login);

export default router;
