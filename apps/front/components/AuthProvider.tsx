'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { UserRole } from '@website/shared-types';

import { API } from '@/lib/api';

import { useNotification } from './NotificationProvider';

type AuthContextType = {
  token?: string;
  userRole?: UserRole;
  isSet: boolean;
  login: (username: string, password: string) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}): ReactElement => {
  const [token, setToken] = useState<string>();
  const [userRole, setUserRole] = useState<UserRole>();
  const [isSet, setIsSet] = useState(false);

  const { notify } = useNotification();

  const router = useRouter();

  const login = useCallback<
    (username: string, password: string) => Promise<void>
  >(
    async (username, password) => {
      try {
        const { access_token, role } = await API.login(username, password);

        sessionStorage.setItem('token', access_token);
        sessionStorage.setItem('userRole', role);

        API.setAuth(access_token);
        setToken(access_token);
        setUserRole(role);

        router.push('/admin');
      } catch (error) {
        notify('Erreur de connexion', { severity: 'error' });
        console.error(error);
      }
    },
    [notify, router],
  );

  const logout = useCallback(async () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    API.removeAuth();
    setToken(undefined);
    setUserRole(undefined);

    // A small timeout before doing anything else (like redirecting),
    // so that the state has time to update
    await new Promise((resolve) => setTimeout(resolve, 500));
  }, []);

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('token') ?? undefined;
    const role = sessionStorage.getItem('userRole') as UserRole | null;

    setToken(sessionToken);

    if (sessionToken) API.setAuth(sessionToken);

    if (role) setUserRole(role);
  }, []);

  useEffect(() => {
    setIsSet(true);
  }, []);

  return (
    <AuthContext.Provider value={{ token, userRole, isSet, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
