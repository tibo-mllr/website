'use client';

import { Box, Card, CardHeader, Modal } from '@mui/material';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { frontUserSchema } from '@website/shared-types';

import { useNotification } from '@/components/NotificationProvider';
import { API } from '@/lib/api';
import { selectToken, selectUserRole } from '@/lib/redux/slices';
import { type FrontUserDocument } from '@/lib/utils';

import UserForm from './UserForm';

type EditUserProps = {
  userToEdit: Omit<FrontUserDocument, 'password'>;
  show: boolean;
  setShow: (show: boolean) => void;
};

export default function EditUserModal({
  userToEdit,
  show,
  setShow,
}: EditUserProps): ReactElement {
  const userRole = useSelector(selectUserRole);
  const token = useSelector(selectToken);

  const { notify } = useNotification();

  const handleEdit = (values: FrontUserDocument): void => {
    const changes = values;
    if (changes.password === '') delete changes.password;

    API.editUser(userToEdit._id, changes, userRole)
      .then(() => {
        notify('User edited', { severity: 'success' });
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
        width="fit"
        maxHeight="100vh"
        overflow="auto"
        position="absolute"
        left="50%"
        top="50%"
        sx={{ transform: 'translate(-50%, -100%)' }}
      >
        <Card className="px-15 py-5">
          <CardHeader title="Edit user" />
          <UserForm
            initialValues={{ ...userToEdit, password: '' }}
            validationSchema={toFormikValidationSchema(
              frontUserSchema.omit({ password: true }).extend({
                password: frontUserSchema.shape.password.optional(),
              }),
            )}
            onSubmit={handleEdit}
            token={token}
            userRole={userRole}
            edit
          />
        </Card>
      </Box>
    </Modal>
  );
}
