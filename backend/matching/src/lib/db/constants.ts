export const SEED_KEY = 'SEED';

// Hash Pool for matching
export const POOL_INDEX = 'requestsIdx';
export const MATCH_PREFIX = 'match:';

// Stream for queuing
export const STREAM_NAME = 'requests';
export const STREAM_GROUP = 'requestsGroup'; // XGROUP CREATE STREAM_NAME STREAM_GROUP
export const STREAM_WORKER = 'requestsProcessor'; // XGROUP CREATECONSUMER STREAM_NAME STREAM_GROUP STREAM_WORKER
export const STREAM_CLEANER = 'requestsCleaner'; // XGROUP CREATECONSUMER STREAM_NAME STREAM_GROUP STREAM_CLEANER
