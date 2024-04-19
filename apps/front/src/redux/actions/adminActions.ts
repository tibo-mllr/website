import { client, type FrontUserDocument } from '@/utils';
import { receiveUsers, requestUsers } from '../slices';
import { type AppThunk } from '../types';

export function fetchUsers(): AppThunk {
  return async (dispatch, getState) => {
    const {
      adminReducer: { userRole },
    } = getState();

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
