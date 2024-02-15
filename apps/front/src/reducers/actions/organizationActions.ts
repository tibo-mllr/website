import { OrganizationDocument } from 'organization';
import { client } from 'utils';
import { receiveOrganizations, requestOrganizations } from '../slices';
import { AppThunk } from '../types';

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
