import express from 'express';

import { getCollabRoom } from '@/controller/collab-controller';
import { getRoomsController } from '@/controller/get-rooms-controller';
import { authCheck } from '@/controller/room-auth-controller';

const router = express.Router();

router.get('/', getCollabRoom);
router.get('/rooms', getRoomsController);
router.get('/auth', authCheck);

export default router;
