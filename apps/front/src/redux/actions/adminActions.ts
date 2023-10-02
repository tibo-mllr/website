import { FrontUserDocument } from 'admin/utilsAdmin';
import { receiveUsers, requestUsers } from 'redux/slices';
import { AppThunk } from 'redux/types';
import { client } from 'utils';

export function fetchUsers(): AppThunk {
  return async (dispatch, getState) => {
    const {
      adminReducer: { userRole, token },
    } = getState();
    try {
      dispatch(requestUsers());

      const { data } = await client.get<FrontUserDocument[]>(
        `/user/${userRole}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      dispatch(receiveUsers(data));
    } catch (error) {
      console.error(error);
      dispatch(receiveUsers([]));
    }
  };
}
