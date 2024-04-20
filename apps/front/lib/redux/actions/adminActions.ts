import { client, type FrontUserDocument } from '@/lib/utils';
import { receiveUsers, requestUsers } from '../slices';
import { type AppThunk } from '../types';

export function fetchUsers(): AppThunk {
  return async (dispatch, getState) => {
    const { userRole } = getState().admin;

    try {
      dispatch(requestUsers());

      const { data } = await client.get<FrontUserDocument[]>(
        `/user/${userRole}`,
      );

      dispatch(receiveUsers(data));
    } catch (error) {
      console.error(error);
      dispatch(receiveUsers([]));
    }
  };
}
