'use client';

import { extendTheme, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { useEffect, useRef, type ReactElement, type ReactNode } from 'react';
import { Provider } from 'react-redux';

import { NotificationProvider } from '@/components/NotificationProvider';
import { initAdmin } from '@/lib/redux/slices';

import { AppStore, makeStore } from './redux/types';

const theme = extendTheme({
  colorSchemes: {
    light: { palette: { primary: { main: '#854afc' } } },
    dark: { palette: { primary: { main: '#854afc' } } },
  },
});

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
  }, [storeRef]);

  return (
    <Provider store={storeRef.current}>
      <NotificationProvider>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </NotificationProvider>
    </Provider>
  );
}
