'use client';

import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { Grid, IconButton } from '@mui/material';
import { ReactElement, useState } from 'react';

import { UserRole } from '@website/shared-types';

import { ConfirmModal, useNotification } from '@/components';
import { API } from '@/lib/api';
import { FrontUserDocument } from '@/lib/utils';

import EditUserModal from './EditUserModal';

type UserActionsProps = {
  user: FrontUserDocument;
};

export function UserActions({ user }: UserActionsProps): ReactElement {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [userToEdit, setUserToEdit] = useState<
    Omit<FrontUserDocument, 'password'>
  >({
    _id: '',
    username: '',
    role: UserRole.Admin,
  });

  const { notify } = useNotification();

  const handleDelete = (id: string): void => {
    API.deleteUser(id)
      .then(() => notify('User deleted', { severity: 'success' }))
      .catch((error) => {
        notify('Error deleting user', { severity: 'error' });
        console.error(error);
      });
  };

  return (
    <Grid display="flex" width="100%" justifyContent="space-between">
      <ConfirmModal
        title="Delete user"
        message="Are you sure you want to delete this user?"
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleDelete(userToEdit._id)}
      />
      <EditUserModal
        userToEdit={userToEdit}
        show={showEdit}
        setShow={setShowEdit}
      />
      <IconButton
        aria-label="Edit"
        onClick={() => {
          setShowEdit(true);
          setUserToEdit(user);
        }}
        color="warning"
      >
        <EditTwoToneIcon />
      </IconButton>
      <IconButton
        aria-label="Delete"
        onClick={() => {
          setShowConfirm(true);
          setUserToEdit(user);
        }}
        color="error"
      >
        <DeleteForeverTwoToneIcon />
      </IconButton>
    </Grid>
  );
}
