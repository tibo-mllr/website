'use client';

import { switchShowNewOrganization } from '@/redux/slices';
import { type AppState } from '@/redux/types';
import { client, type OrganizationDocument } from '@/utils';
import { type Organization } from '@website/shared-types';
import { useSnackbar } from 'notistack';
import { type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import OrganizationForm from './OrganizationForm';

const stateProps = (
  state: AppState,
): Pick<AppState['organizationReducer'], 'showNew'> => ({
  showNew: state.organizationReducer.showNew,
});

const dispatchProps = {
  setShow: switchShowNewOrganization,
};

const connector = connect(stateProps, dispatchProps);

export function CreateOrganizationModal({
  showNew,
  setShow,
}: ConnectedProps<typeof connector>): ReactElement {
  const emptyOrganization: Organization = {
    name: '',
    description: '',
    location: '',
    website: '',
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = (newOrganization: Organization): void => {
    client
      .post<OrganizationDocument>('/organization', newOrganization)
      .then(() => {
        enqueueSnackbar('Organization added', { variant: 'success' });
        setShow(false);
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal show={showNew} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>New Organization</Modal.Title>
      </Modal.Header>
      <OrganizationForm
        create
        initialValues={emptyOrganization}
        onSubmit={handleCreate}
      />
    </Modal>
  );
}

export default connector(CreateOrganizationModal);
