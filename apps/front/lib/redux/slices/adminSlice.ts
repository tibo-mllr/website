import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type UserRole } from '@website/shared-types';

import { API } from '@/lib/api';

type AdminState = {
  userRole?: UserRole;
  token?: string;
  showNew: boolean;
};

const initialState: AdminState = {
  userRole: undefined,
  token: undefined,
  showNew: false,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    initAdmin(state) {
      state.userRole =
        (sessionStorage.getItem('userRole') as UserRole | null) ?? undefined;
      state.token = sessionStorage.getItem('token') ?? undefined;
      if (state.token && state.userRole)
        API.setAuth(state.token, state.userRole);
    },
    login(state, action: PayloadAction<{ userRole: UserRole; token: string }>) {
      state.userRole = action.payload.userRole;
      state.token = action.payload.token;
      API.setAuth(action.payload.token, action.payload.userRole);
    },
    logout(state) {
      state.userRole = undefined;
      state.token = undefined;
      API.removeAuth();
    },
    switchShowNewUser(state, action: PayloadAction<boolean>) {
      state.showNew = action.payload;
    },
  },
  selectors: {
    selectUserRole: (state) => state.userRole,
    selectToken: (state) => state.token,
    selectShowNewUser: (state) => state.showNew,
  },
});

export const { initAdmin, login, logout, switchShowNewUser } =
  adminSlice.actions;

export const { selectUserRole, selectToken, selectShowNewUser } =
  adminSlice.selectors;
