import { type FrontUserDocument } from 'admin/utilsAdmin';
import { receiveUsers, requestUsers } from 'reducers/slices';
import { type AppThunk } from 'reducers/types';
import { client } from 'utils';

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
