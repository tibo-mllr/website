import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AdminState = {
  showNew: boolean;
};

const initialState: AdminState = {
  showNew: false,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    switchShowNewUser(state, action: PayloadAction<boolean>) {
      state.showNew = action.payload;
    },
  },
  selectors: {
    selectShowNewUser: (state) => state.showNew,
  },
});

export const { switchShowNewUser } = adminSlice.actions;

export const { selectShowNewUser } = adminSlice.selectors;
