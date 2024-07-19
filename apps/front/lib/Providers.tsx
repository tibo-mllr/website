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

  useEffect(() => {
    if (storeRef.current) storeRef.current.dispatch(initAdmin());

    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';

    document.documentElement.setAttribute('data-bs-theme', theme);
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
