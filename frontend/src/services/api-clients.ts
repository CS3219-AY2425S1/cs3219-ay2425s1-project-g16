import axios from 'axios';

export const USER_SERVICE = '/user-service';
export const QUESTION_SERVICE = '/question-service';
export const MATCHING_SERVICE = '/matching-service';

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
  baseURL: QUESTION_SERVICE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const matchApiClient = axios.create({
  baseURL: MATCHING_SERVICE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// define more api clients for other microservices
