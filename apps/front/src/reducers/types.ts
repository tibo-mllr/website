import { configureStore } from '@reduxjs/toolkit';
import { type Action } from 'redux';
import { type ThunkAction } from 'redux-thunk';
import reducer from './slices';

export const store = configureStore({
  reducer,
});

export type AppState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  Promise<ReturnType>,
  AppState,
  unknown,
  Action
>;

export type AppDispatch = typeof store.dispatch;
