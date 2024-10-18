import { Router } from 'express';

import { matchRequestController } from '@/controllers/match-request';

const route = Router();

route.post('/request', matchRequestController);

export default route;
