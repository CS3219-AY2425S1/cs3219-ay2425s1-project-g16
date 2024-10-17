import 'dotenv/config';

export const UI_HOST = process.env.PEERPREP_UI_HOST!;

export const EXPRESS_PORT = process.env.EXPRESS_PORT;

const DB_HOSTNAME = process.env.MATCHING_DB_HOSTNAME;
const DB_PORT = Number.parseInt(process.env.MATCHING_DB_PORT ?? '6379');
// export const DB_URL = `redis://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOSTNAME}:${DB_PORT}`;
export const DB_URL = `redis://${DB_HOSTNAME}:${DB_PORT}`;

export const NODE_ENV = process.env.NODE_ENV;

export const IS_MILESTONE_D4 = true;
