import axios from 'axios';

import { PEERPREP_COLLAB_HOST, PEERPREP_QUESTION_HOST, PEERPREP_USER_HOST } from '@/config';

const basePostConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const userServiceClient = axios.create({
  baseURL: PEERPREP_USER_HOST,
  ...basePostConfig,
});

export const questionServiceClient = axios.create({
  baseURL: PEERPREP_QUESTION_HOST,
  ...basePostConfig,
});

export const collabServiceClient = axios.create({
  baseURL: PEERPREP_COLLAB_HOST,
  withCredentials: true,
});

export const routes = {
  USER_SERVICE: {
    ATTEMPTED_QNS: {
      GET: {
        path: '/user/attempted-question/get',
      },
      ADD: {
        path: '/user/attempted-question/add',
      },
    },
  },
  QUESTION_SERVICE: {
    GET_RANDOM_QN: {
      path: '/questions/random',
    },
  },
  COLLAB_SERVICE: {
    GET_ROOM: {
      path: '/room',
    },
  },
};
