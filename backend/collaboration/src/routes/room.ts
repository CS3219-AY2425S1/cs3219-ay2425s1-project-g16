import express from 'express';

import { getCollabRoom } from '@/controller/collab-controller';
import { authCheck } from '@/controller/room-auth-controller';

const router = express.Router();

router.get('/', getCollabRoom);
router.get('/auth', authCheck);

export default router;
