'use client';

import { Box, Card, CardHeader, Modal } from '@mui/material';
import { type ReactElement } from 'react';

import { useNotification } from '@/components/NotificationProvider';
import { API } from '@/lib/api';
import { type OrganizationDocument } from '@/lib/utils';

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
  const { notify } = useNotification();

  const handleEdit = (values: OrganizationDocument): void => {
    API.editOrganization(organizationToEdit._id, values)
      .then(() => {
        notify('Organization edited', { severity: 'success' });
        setShow(false);
      })
      .catch((error) => {
        notify(error, { severity: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal open={show} onClose={() => setShow(false)}>
      <Box
        padding={2}
        width="30vw"
        minWidth={300}
        maxHeight="100vh"
        overflow="auto"
        position="absolute"
        left="50%"
        sx={{ transform: 'translate(-50%, 0)' }}
      >
        <Card>
          <CardHeader title="Edit organizaton" />
          <OrganizationForm
            edit
            initialValues={organizationToEdit}
            onSubmit={handleEdit}
          />
        </Card>
      </Box>
    </Modal>
  );
}
