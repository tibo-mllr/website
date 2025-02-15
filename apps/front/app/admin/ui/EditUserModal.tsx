'use client';

import { useSnackbar } from 'notistack';
import { type ReactElement } from 'react';
import { Card, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { frontUserSchema } from '@website/shared-types';

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

  const { enqueueSnackbar } = useSnackbar();

  const handleEdit = (values: FrontUserDocument): void => {
    API.editUser(userToEdit._id, values)
      .then(() => {
        enqueueSnackbar('User edited', { variant: 'success' });
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
        <Card.Title>Edit user</Card.Title>
      </Modal.Header>
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
    </Modal>
  );
}
