'use client';

import { CustomSnackbar } from '@/components';
import { initAdmin } from '@/lib/redux/slices';
import { SnackbarProvider } from 'notistack';
import { type ReactElement, type ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { AppStore, makeStore } from './redux/types';

export default function Providers({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  const getTheme = (): string =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

  const setTheme = (theme: string): void =>
    document.documentElement.setAttribute('data-bs-theme', theme);

  useEffect(() => {
    if (storeRef.current) storeRef.current.dispatch(initAdmin());

    setTheme(getTheme());

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        setTheme(getTheme());
      });
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
