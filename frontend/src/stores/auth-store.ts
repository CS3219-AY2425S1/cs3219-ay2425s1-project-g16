import { createContext, useContext } from 'react';

type AuthStoreType = {
  userId: string;
  username: string;
  email: string;
  isAdmin?: boolean;
};

const AuthStore = createContext<AuthStoreType>({
  userId: '',
  username: '',
  email: '',
});

export const AuthStoreProvider = AuthStore.Provider;

export const useAuthedRoute = () => {
  const data = useContext(AuthStore);
  return data;
};
