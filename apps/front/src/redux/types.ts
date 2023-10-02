import { configureStore } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import reducer from './slices';

export const store = configureStore({
  reducer,
});

export type AppState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  Promise<ReturnType>,
  AppState,
  unknown,
  AnyAction
>;

export type AppDispatch = typeof store.dispatch;
