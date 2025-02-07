import { API } from '@/lib/api';

import { receiveOrganizations, requestOrganizations } from '../slices';
import { type AppThunk } from '../types';

export function fetchOrganizations(): AppThunk {
  return async (dispatch) => {
    try {
      dispatch(requestOrganizations());

      const organizations = await API.getOrganizations();

      dispatch(receiveOrganizations(organizations));
    } catch (error) {
      console.error(error);
      dispatch(receiveOrganizations([]));
    }
  };
}
