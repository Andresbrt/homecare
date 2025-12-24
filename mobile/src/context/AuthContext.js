import { createContext } from 'react';

export const AuthContext = createContext({
  token: null,
  user: null,
  loading: false,
  signIn: async () => {},
  signOut: async () => {},
  changeRole: async () => {},
});
