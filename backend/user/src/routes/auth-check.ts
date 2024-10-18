import express from 'express';

import { checkIsAuthed } from '@/controllers/auth-check';

const router = express.Router();

router.get('/is-authed', checkIsAuthed);

export default router;
