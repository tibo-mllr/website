'use client';

import { AlertColor } from '@mui/material';
import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useState,
} from 'react';

import { CustomSnackbar } from './CustomSnackbar'; // adjust path

type NotificationOptions = {
  severity?: AlertColor;
};

export type Notify = (msg: string, options?: NotificationOptions) => void;

type NotificationContextType = {
  notify: Notify;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const notify = useCallback((msg: string, options?: NotificationOptions) => {
    setMessage(msg);
    setSeverity(options?.severity || 'info');
    setOpen(true);
  }, []);

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <CustomSnackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
        severity={severity}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }
  return context;
}
