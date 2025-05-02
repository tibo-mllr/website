import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type ProjectState = {
  showNew: boolean;
};

const initialState: ProjectState = {
  showNew: false,
};

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    switchShowNewProject(state, action: PayloadAction<boolean>) {
      state.showNew = action.payload;
    },
  },
  selectors: {
    selectShowNewProject: (state) => state.showNew,
  },
});

export const { switchShowNewProject } = projectSlice.actions;

export const { selectShowNewProject } = projectSlice.selectors;
