'use client';

import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { CardActions, Grid, IconButton } from '@mui/material';
import { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';

import { ConfirmModal, useNotification } from '@/components';
import { API } from '@/lib/api';
import { selectToken, selectUserRole } from '@/lib/redux/slices';
import { OrganizationDocument } from '@/lib/utils';

import EditOrganizationModal from './EditOrganizationModal';

type OrganizationActionsProps = {
  organization: OrganizationDocument;
};

export function OrganizationActions({
  organization,
}: OrganizationActionsProps): ReactElement {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [organizationToEdit, setOrganizationToEdit] =
    useState<OrganizationDocument>({
      _id: '',
      name: '',
      location: '',
      description: '',
      website: '',
    });

  const token = useSelector(selectToken);
  const userRole = useSelector(selectUserRole);

  const { notify } = useNotification();

  const handleDelete = (id: string): void => {
    API.deleteOrganization(id)
      .then(() => notify('Organization deleted', { severity: 'success' }))
      .catch((error) => {
        notify('Error deleting organization', { severity: 'error' });
        console.error(error);
      });
  };

  if (!token || userRole !== 'superAdmin') return <></>;

  return (
    <CardActions>
      <Grid container justifyContent="end" width="100%">
        <IconButton
          aria-label="Edit"
          onClick={() => {
            setShowEdit(true);
            setOrganizationToEdit(organization);
          }}
          color="warning"
        >
          <EditTwoToneIcon />
        </IconButton>
        <IconButton
          aria-label="Delete"
          onClick={() => {
            setShowConfirm(true);
            setOrganizationToEdit(organization);
          }}
          color="error"
        >
          <DeleteForeverTwoToneIcon />
        </IconButton>
      </Grid>
      <ConfirmModal
        title="Delete organization"
        message="Are you sure you want to delete this organization?"
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleDelete(organizationToEdit._id)}
      />
      <EditOrganizationModal
        organizationToEdit={organizationToEdit}
        show={showEdit}
        setShow={setShowEdit}
      />
    </CardActions>
  );
}
