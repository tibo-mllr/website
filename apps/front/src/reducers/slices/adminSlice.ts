import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type UserRole } from '@website/shared-types';
import { type FrontUserDocument } from 'admin/utilsAdmin';

type AdminState = {
  userRole?: UserRole;
  token?: string;
  isLoading: boolean;
  users: FrontUserDocument[];
  showNew: boolean;
};

const initialState: AdminState = {
  userRole:
    (sessionStorage.getItem('userRole') as UserRole | null) ?? undefined,
  token: sessionStorage.getItem('token') ?? undefined,
  isLoading: false,
  users: [],
  showNew: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ userRole: UserRole; token: string }>) {
      state.userRole = action.payload.userRole;
      state.token = action.payload.token;
      sessionStorage.setItem('userRole', action.payload.userRole);
      sessionStorage.setItem('token', action.payload.token);
    },
    logout(state) {
      state.userRole = undefined;
      state.token = undefined;
      state.users = [];
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('token');
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
