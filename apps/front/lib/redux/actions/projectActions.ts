import { API } from '@/lib/api';
import {
  receiveCompetencies,
  receiveProjects,
  receiveResume,
  requestProjects,
  requestResume,
} from '../slices';
import { type AppThunk } from '../types';

export function fetchProjects(): AppThunk {
  return async (dispatch) => {
    try {
      dispatch(requestProjects());

      const projects = await API.getProjects();

      dispatch(receiveProjects(projects));
    } catch (error) {
      console.error(error);
      dispatch(receiveProjects([]));
    }
  };
}

export function fetchCompetencies(): AppThunk {
  return async (dispatch) => {
    try {
      const competencies = await API.getCompetencies();

      dispatch(receiveCompetencies(competencies));
    } catch (error) {
      console.error(error);
      dispatch(receiveCompetencies([]));
    }
  };
}

export function fetchResume(): AppThunk {
  return async (dispatch) => {
    try {
      dispatch(requestResume());

      const resume = await API.getResume();

      dispatch(receiveResume(resume));
    } catch (error) {
      console.error(error);
      dispatch(receiveResume({ projects: [], competencies: [] }));
    }
  };
}
