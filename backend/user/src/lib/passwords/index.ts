import bcrypt from 'bcrypt';

export const getIsPasswordValid = (payload: string, actualPassword: string) => {
  return bcrypt.compareSync(payload, actualPassword);
};

export const generatePasswordHash = (password: string) => {
  return bcrypt.hashSync(password, 10);
};
