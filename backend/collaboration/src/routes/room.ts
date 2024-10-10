import { getCollabRoom } from '@/controller/collab-controller';
import express from 'express';

const router = express.Router();

router.get('/', getCollabRoom);

export default router;
