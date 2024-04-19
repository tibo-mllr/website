import { useSnackbar } from 'notistack';
import { type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import { client } from 'utils';
import OrganizationForm from './OrganizationForm';
import { type OrganizationDocument } from './utilsOrganization';

type EditOrganizationProps = {
  organizationToEdit: OrganizationDocument;
  show: boolean;
  setShow: (show: boolean) => void;
};

export default function EditOrganizationModal({
  organizationToEdit,
  show,
  setShow,
}: EditOrganizationProps): ReactElement {
  const { enqueueSnackbar } = useSnackbar();

  const handleEdit = (values: OrganizationDocument): void => {
    client
      .put<OrganizationDocument>(
        `/organization/${organizationToEdit._id}`,
        values,
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
