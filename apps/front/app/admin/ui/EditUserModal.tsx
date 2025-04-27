'use client';

import { Card, CardHeader, Modal } from '@mui/material';
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
  userToEdit: FrontUserDocument;
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
    API.editUser(userToEdit._id, values)
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
      <Card>
        <CardHeader title="Edit user" closeButton />
        <UserForm
          initialValues={userToEdit}
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
    </Modal>
  );
}
