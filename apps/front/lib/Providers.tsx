'use client';

import { SnackbarProvider } from 'notistack';
import { useEffect, useRef, type ReactElement, type ReactNode } from 'react';
import { Provider } from 'react-redux';

import {
  getPreferredTheme,
  getStoredTheme,
  setTheme,
  showActiveTheme,
} from '@/app/ui/theme';
import { CustomSnackbar } from '@/components';
import { initAdmin } from '@/lib/redux/slices';

import { AppStore, makeStore } from './redux/types';

export default function Providers({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current) storeRef.current.dispatch(initAdmin());

    setTheme(getPreferredTheme());

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        const storedTheme = getStoredTheme();
        if (storedTheme !== 'light' && storedTheme !== 'dark') {
          setTheme(getPreferredTheme());
        }
      });

    showActiveTheme(getPreferredTheme());
  }, [storeRef]);

  return (
    <Provider store={storeRef.current}>
      <SnackbarProvider
        preventDuplicate
        Components={{
          success: CustomSnackbar,
          error: CustomSnackbar,
          warning: CustomSnackbar,
          info: CustomSnackbar,
        }}
      >
        {children}
      </SnackbarProvider>
    </Provider>
  );
}
