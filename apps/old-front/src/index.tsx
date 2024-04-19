import App from 'App';
import { CustomSnackbar } from 'components';
import { SnackbarProvider } from 'notistack';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from 'reducers/types';
import 'custom.scss';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <Provider store={store}>
      <SnackbarProvider
        preventDuplicate
        Components={{
          success: CustomSnackbar,
          error: CustomSnackbar,
          warning: CustomSnackbar,
          info: CustomSnackbar,
        }}
      >
        <App />
      </SnackbarProvider>
    </Provider>
  </StrictMode>,
);
