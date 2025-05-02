'use client';

import { extendTheme, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { useRef, type ReactElement, type ReactNode } from 'react';
import { Provider } from 'react-redux';

import { NotificationProvider } from '@/components/NotificationProvider';

import { AppStore, makeStore } from '../lib/redux/types';

import { AuthProvider } from './AuthProvider';

const theme = extendTheme({
  colorSchemes: {
    light: { palette: { primary: { main: '#854afc' } } },
    dark: { palette: { primary: { main: '#854afc' } } },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          opacity: 0.75,
          '.MuiModal-root &': { opacity: 1 },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottomWidth: 1,
          borderBottomColor: theme.palette.divider,
          backgroundColor:
            'color-mix(in srgb, var(--mui-palette-background-paper), var(--mui-palette-primary-main))',
          '.MuiModal-root &': {
            backgroundColor: 'unset',
            borderBottom: 'unset',
          },
        }),
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderTopWidth: 1,
          borderTopColor: theme.palette.divider,
          backgroundColor:
            'color-mix(in srgb, var(--mui-palette-background-paper) 90%, var(--mui-palette-text-primary))',
          '.MuiModal-root &': {
            backgroundColor: 'unset',
            borderTop: 'unset',
          },
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { paddingTop: 0, paddingBottom: 0 } },
    },
  },
});

export function Providers({ children }: { children: ReactNode }): ReactElement {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <NotificationProvider>
            <AuthProvider>{children}</AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </Provider>
  );
}
