import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type OrganizationState = {
  showNew: boolean;
};

const initialState: OrganizationState = {
  showNew: false,
};

export const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    switchShowNewOrganization(state, action: PayloadAction<boolean>) {
      state.showNew = action.payload;
    },
  },
  selectors: {
    selectShowNewOrganization: (state) => state.showNew,
  },
});

export const { switchShowNewOrganization } = organizationSlice.actions;

export const { selectShowNewOrganization } = organizationSlice.selectors;
