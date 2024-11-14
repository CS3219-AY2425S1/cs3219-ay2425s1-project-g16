import express from 'express';

import { queryOpenAI } from '@/controller/openai-controller';

const router = express.Router();

router.post('/chat/stream', queryOpenAI);
router.post('/chat', queryOpenAI);

export default router;
