import { type Organization } from '@website/shared-types';
import { useSnackbar } from 'notistack';
import { type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { switchShowNewOrganization } from 'reducers/slices';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import OrganizationForm from './OrganizationForm';
import { type OrganizationDocument } from './utilsOrganization';

const stateProps = (
  state: AppState,
): Pick<
  AppState['organizationReducer'] & AppState['adminReducer'],
  'showNew' | 'token'
> => ({
  showNew: state.organizationReducer.showNew,
  token: state.adminReducer.token,
});

const dispatchProps = {
  setShow: switchShowNewOrganization,
};

const connector = connect(stateProps, dispatchProps);

export function CreateOrganizationModal({
  showNew,
  token,
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
      .post<OrganizationDocument>('/organization', newOrganization, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
