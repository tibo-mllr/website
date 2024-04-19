'use client';

import { type FrontUserDocument, removeAuth, setAuth } from '@/utils';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UserRole } from '@website/shared-types';

type AdminState = {
  userRole?: UserRole;
  token?: string;
  isLoading: boolean;
  users: FrontUserDocument[];
  showNew: boolean;
};

const initialState: AdminState = {
  userRole: undefined,
  token: undefined,
  isLoading: false,
  users: [],
  showNew: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    initAdmin(state) {
      state.userRole =
        (sessionStorage.getItem('userRole') as UserRole | null) ?? undefined;
      state.token = sessionStorage.getItem('token') ?? undefined;
      if (state.token && state.userRole) setAuth(state.token, state.userRole);
    },
    login(state, action: PayloadAction<{ userRole: UserRole; token: string }>) {
      state.userRole = action.payload.userRole;
      state.token = action.payload.token;
      setAuth(action.payload.token, action.payload.userRole);
    },
    logout(state) {
      state.userRole = undefined;
      state.token = undefined;
      state.users = [];
      removeAuth();
    },
    requestUsers(state) {
      state.isLoading = true;
    },
    receiveUsers(state, action: PayloadAction<FrontUserDocument[]>) {
      state.users = action.payload;
      state.isLoading = false;
    },
    addUser(state, action: PayloadAction<FrontUserDocument>) {
      state.users.push(action.payload);
    },
    deleteUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
    editUser(state, action: PayloadAction<FrontUserDocument>) {
      state.users = state.users.map((user) =>
        user._id === action.payload._id ? action.payload : user,
      );
    },
    switchShowNewUser(state, action: PayloadAction<boolean>) {
      state.showNew = action.payload;
    },
  },
});

export const {
  initAdmin,
  login,
  logout,
  requestUsers,
  receiveUsers,
  addUser,
  deleteUser,
  editUser,
  switchShowNewUser,
} = adminSlice.actions;

export default adminSlice.reducer;