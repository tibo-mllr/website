import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type OrganizationDocument } from '@/lib/utils';

type OrganizationState = {
  organizations: OrganizationDocument[];
  isLoading: boolean;
  showNew: boolean;
};

const initialState: OrganizationState = {
  organizations: [],
  isLoading: false,
  showNew: false,
};

export const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    requestOrganizations(state) {
      state.isLoading = true;
    },
    receiveOrganizations(state, action: PayloadAction<OrganizationDocument[]>) {
      state.organizations = action.payload;
      state.isLoading = false;
    },
    addOrganization(state, action: PayloadAction<OrganizationDocument>) {
      state.organizations.push(action.payload);
    },
    deleteOrganization(state, action: PayloadAction<string>) {
      state.organizations = state.organizations.filter(
        (organization) => organization._id !== action.payload,
      );
    },
    editOrganization(state, action: PayloadAction<OrganizationDocument>) {
      state.organizations = state.organizations.map((organization) =>
        organization._id === action.payload._id ? action.payload : organization,
      );
    },
    switchShowNewOrganization(state, action: PayloadAction<boolean>) {
      state.showNew = action.payload;
    },
  },
  selectors: {
    selectShowNewOrganization: (state) => state.showNew,
    selectOrganizationsLoading: (state) => state.isLoading,
    selectOrganizations: (state) => state.organizations,
  },
});

export const {
  requestOrganizations,
  receiveOrganizations,
  addOrganization,
  deleteOrganization,
  editOrganization,
  switchShowNewOrganization,
} = organizationSlice.actions;

export const {
  selectShowNewOrganization,
  selectOrganizationsLoading,
  selectOrganizations,
} = organizationSlice.selectors;
