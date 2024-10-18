import express from 'express';

import { getCollabRoom } from '@/controller/collab-controller';

const router = express.Router();

router.get('/', getCollabRoom);

export default router;
