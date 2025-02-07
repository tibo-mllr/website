import { configureStore } from '@reduxjs/toolkit';
import { type Action } from 'redux';
import { type ThunkAction } from 'redux-thunk';

import reducer from './slices';

export const makeStore = () =>
  configureStore({
    reducer,
  });

export type AppStore = ReturnType<typeof makeStore>;

export type AppState = ReturnType<AppStore['getState']>;

export type AppThunk<ReturnType = void> = ThunkAction<
  Promise<ReturnType>,
  AppState,
  unknown,
  Action
>;

export type AppDispatch = AppStore['dispatch'];
