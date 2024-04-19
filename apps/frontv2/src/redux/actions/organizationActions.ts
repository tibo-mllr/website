import { client, type OrganizationDocument } from '@/utils';
import { receiveOrganizations, requestOrganizations } from '../slices';
import { type AppThunk } from '../types';

export function fetchOrganizations(): AppThunk {
  return async (dispatch) => {
    try {
      dispatch(requestOrganizations());

      const { data } =
        await client.get<OrganizationDocument[]>('/organization');

      dispatch(receiveOrganizations(data));
    } catch (error) {
      console.error(error);
      dispatch(receiveOrganizations([]));
    }
  };
}
