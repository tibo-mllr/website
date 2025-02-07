'use client';

import { useSnackbar } from 'notistack';
import { type ReactElement } from 'react';
import { Card, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import {
  frontUserSchema,
  UserRole,
  type FrontUser,
} from '@website/shared-types';

import { API } from '@/lib/api';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  selectShowNewUser,
  selectToken,
  selectUserRole,
  switchShowNewUser,
} from '@/lib/redux/slices';

import UserForm from './UserForm';

type CreateUserProps = {
  newSelf?: boolean;
};

export default function CreateUserModal({
  newSelf = false,
}: CreateUserProps): ReactElement {
  const emptyUser: FrontUser = {
    username: '',
    password: '',
    role: UserRole.Admin,
  };

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useAppDispatch();
  const userRole = useSelector(selectUserRole);
  const token = useSelector(selectToken);
  const showNew = useSelector(selectShowNewUser);

  const handleCreate = (newUser: FrontUser): void => {
    API.createUser(newUser, newSelf)
      .then(() => {
        enqueueSnackbar(newSelf ? 'Account created' : 'User added', {
          variant: 'success',
        });
        dispatch(switchShowNewUser(false));
      })
      .catch((error) => {
        if (error.response?.status === 409)
          enqueueSnackbar('Username already exists', { variant: 'error' });
        else {
          enqueueSnackbar(error, { variant: 'error' });
          console.error(error);
        }
      });
  };

  return (
    <Modal show={showNew} onHide={() => dispatch(switchShowNewUser(false))}>
      <Modal.Header closeButton>
        <Card.Title>New user</Card.Title>
      </Modal.Header>
      <UserForm
        initialValues={emptyUser}
        onSubmit={async (values) => {
          handleCreate(values);
        }}
        validationSchema={toFormikValidationSchema(frontUserSchema)}
        token={token}
        userRole={userRole}
        create
      />
    </Modal>
  );
}
