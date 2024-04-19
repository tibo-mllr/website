import { type ProjectDocument, type Resume } from '@/utils';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type ProjectState = {
  projects: ProjectDocument[];
  isLoading: boolean;
  showNew: boolean;
  resume: Resume;
  resumeLoading: boolean;
  competencies: string[];
};

const initialState: ProjectState = {
  projects: [],
  isLoading: false,
  showNew: false,
  resume: {
    projects: [],
    competencies: [],
  },
  resumeLoading: false,
  competencies: [],
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    requestProjects(state) {
      state.isLoading = true;
    },
    receiveProjects(state, action: PayloadAction<ProjectDocument[]>) {
      state.projects = action.payload;
      state.isLoading = false;
    },
    addProject(state, action: PayloadAction<ProjectDocument>) {
      state.projects.push(action.payload);
    },
    deleteProject(state, action: PayloadAction<string>) {
      state.projects = state.projects.filter(
        (project) => project._id !== action.payload,
      );
    },
    editProject(state, action: PayloadAction<ProjectDocument>) {
      state.projects = state.projects.map((project) =>
        project._id === action.payload._id ? action.payload : project,
      );
    },
    switchShowNewProject(state, action: PayloadAction<boolean>) {
      state.showNew = action.payload;
    },
    requestResume(state) {
      state.resumeLoading = true;
    },
    receiveResume(state, action: PayloadAction<Resume>) {
      state.resume = action.payload;
      state.resumeLoading = false;
    },
    receiveCompetencies(state, action: PayloadAction<string[]>) {
      state.competencies = action.payload;
    },
    addCompetencies(state, action: PayloadAction<string[]>) {
      state.competencies = [...state.competencies, ...action.payload].filter(
        (value, index, self) => self.indexOf(value) === index,
      );
    },
  },
});

export const {
  requestProjects,
  receiveProjects,
  addProject,
  deleteProject,
  editProject,
  switchShowNewProject,
  requestResume,
  receiveResume,
  receiveCompetencies,
  addCompetencies,
} = projectSlice.actions;

export default projectSlice.reducer;
