export const WS_EVENT = {
  CONNECT: 'connect',
  MESSAGE: 'message',
  JOIN_ROOM: 'joinRoom',
  CANCEL_ROOM: 'cancelRoom',
  LEAVE_ROOM: 'leave',
  START_QUEUING: 'startQueuing',
  DISCONNECT: 'disconnect',
} as const;

export const MATCHING_EVENT = {
  ERROR: 'ERROR', // When match encounters error
  QUEUED: 'QUEUED', // When match joins pool
  MATCHING: 'MATCHING', // When matching in progress
  PENDING: 'PENDING', // When waiting for match
  SUCCESS: 'SUCCESS', // When match successful
  FAILED: 'FAILED', // When match failed
  DISCONNECT: 'DISCONNECT', // To disconnect all sockets in room
} as const;
