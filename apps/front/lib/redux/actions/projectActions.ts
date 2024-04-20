import { type ProjectDocument, type Resume, client } from '@/lib/utils';
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

      const { data } = await client.get<ProjectDocument[]>('/project');

      dispatch(receiveProjects(data));
    } catch (error) {
      console.error(error);
      dispatch(receiveProjects([]));
    }
  };
}

export function fetchCompetencies(): AppThunk {
  return async (dispatch) => {
    try {
      const { data } = await client.get<string[]>('/project/competencies');

      dispatch(receiveCompetencies(data));
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

      const { data } = await client.get<Resume>('/resume');

      dispatch(receiveResume(data));
    } catch (error) {
      console.error(error);
      dispatch(receiveResume({ projects: [], competencies: [] }));
    }
  };
}
