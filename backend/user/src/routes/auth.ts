import express from 'express';

import { checkEmailValid, checkUsernameValid, login, logout, register } from '@/controllers/auth';
import { limiter } from '@/lib/ratelimit';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);
router.post('/username-valid', checkUsernameValid);
router.post('/email-valid', checkEmailValid);
router.use(limiter);

export default router;
