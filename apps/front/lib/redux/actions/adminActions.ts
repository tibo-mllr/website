import { API } from '@/lib/api';
import { receiveUsers, requestUsers } from '../slices';
import { type AppThunk } from '../types';

export function fetchUsers(): AppThunk {
  return async (dispatch, getState) => {
    const { userRole } = getState().admin;

    try {
      dispatch(requestUsers());

      const users = await API.getUsers(userRole);

      dispatch(receiveUsers(users));
    } catch (error) {
      console.error(error);
      dispatch(receiveUsers([]));
    }
  };
}
