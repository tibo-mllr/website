'use client';

import { API } from '@/lib/api';
import { type OrganizationDocument } from '@/lib/utils';
import { useSnackbar } from 'notistack';
import { type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import OrganizationForm from './OrganizationForm';

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
    API.editOrganization(organizationToEdit._id, values)
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
