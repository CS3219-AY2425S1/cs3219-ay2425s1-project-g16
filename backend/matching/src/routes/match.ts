import { matchRequestController } from '@/controllers/match-request';
import { Router } from 'express';

const route = Router();

route.post('/request', matchRequestController);

export default route;
