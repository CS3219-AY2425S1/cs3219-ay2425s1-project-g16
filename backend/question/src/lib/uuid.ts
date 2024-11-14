import { validate } from 'uuid';

export const isValidUUID = (uuid: string) => {
  return validate(uuid);
};
