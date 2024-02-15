import App from 'App';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'custom.scss';
import { Provider } from 'react-redux';
import { store } from 'reducers/types';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
