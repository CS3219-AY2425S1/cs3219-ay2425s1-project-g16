import { Router } from 'express';

import { cancelMatchRequestController } from '@/controllers/cancel-request';
import { matchRequestController } from '@/controllers/match-request';

const route = Router();

route.post('/request', matchRequestController);
route.post('/cancel', cancelMatchRequestController);

export default route;
