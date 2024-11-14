import { createContext, type Dispatch, type SetStateAction, useContext } from 'react';

type AuthStoreType = {
  userId: string;
  setUserId?: Dispatch<SetStateAction<string>>;
  username: string;
  setUsername?: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail?: Dispatch<SetStateAction<string>>;
  isAdmin?: boolean;
  setIsAdmin?: Dispatch<SetStateAction<boolean>>;
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
