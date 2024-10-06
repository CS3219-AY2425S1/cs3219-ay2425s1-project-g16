import axios from 'axios';

export const USER_SERVICE = '/user-service';
export const QUESTION_SERVICE = '/question-service';

const getApiClientBaseConfig = (service: string) => ({
  baseURL: service,
  withCredentials: true,
});

const basePostHeaders = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const userApiClient = axios.create({
  ...getApiClientBaseConfig(USER_SERVICE),
  ...basePostHeaders,
});

export const userApiGetClient = axios.create(getApiClientBaseConfig(USER_SERVICE));

export const questionApiClient = axios.create({
  baseURL: '/question-service',
  headers: {
    'Content-Type': 'application/json',
  },
});

// define more api clients for other microservices
