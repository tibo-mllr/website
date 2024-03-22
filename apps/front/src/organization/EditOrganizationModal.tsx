import { useSnackbar } from 'notistack';
import { type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import OrganizationForm from './OrganizationForm';
import { type OrganizationDocument } from './utilsOrganization';

type EditOrganizationProps = {
  organizationToEdit: OrganizationDocument;
  show: boolean;
  setShow: (show: boolean) => void;
};

const stateProps = (
  state: AppState,
): Pick<AppState['adminReducer'], 'token'> => ({
  token: state.adminReducer.token,
});

const connector = connect(stateProps);

export function EditOrganizationModal({
  organizationToEdit,
  show,
  setShow,
  token,
}: EditOrganizationProps & ConnectedProps<typeof connector>): ReactElement {
  const { enqueueSnackbar } = useSnackbar();

  const handleEdit = (values: OrganizationDocument): void => {
    client
      .put<OrganizationDocument>(
        `/organization/${organizationToEdit._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        enqueueSnackbar('Organization edited', { variant: 'success' });
        setShow(false);
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Organization</Modal.Title>
      </Modal.Header>
      <OrganizationForm
        edit
        initialValues={organizationToEdit}
        onSubmit={handleEdit}
      />
    </Modal>
  );
}

export default connector(EditOrganizationModal);
