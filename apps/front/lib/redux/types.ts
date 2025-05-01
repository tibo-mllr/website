import { configureStore } from '@reduxjs/toolkit';

import reducer from './slices';

export const makeStore = () =>
  configureStore({
    reducer,
  });

export type AppStore = ReturnType<typeof makeStore>;

export type AppState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];
