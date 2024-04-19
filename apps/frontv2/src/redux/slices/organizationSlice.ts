import { type OrganizationDocument } from '@/utils';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

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

const organizationSlice = createSlice({
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
});

export const {
  requestOrganizations,
  receiveOrganizations,
  addOrganization,
  deleteOrganization,
  editOrganization,
  switchShowNewOrganization,
} = organizationSlice.actions;

export default organizationSlice.reducer;
