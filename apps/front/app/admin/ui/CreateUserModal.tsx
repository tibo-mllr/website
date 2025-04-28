'use client';

import { Box, Card, CardHeader, Modal } from '@mui/material';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import {
  frontUserSchema,
  UserRole,
  type FrontUser,
} from '@website/shared-types';

import { useNotification } from '@/components/NotificationProvider';
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

  const { notify } = useNotification();

  const dispatch = useAppDispatch();
  const userRole = useSelector(selectUserRole);
  const token = useSelector(selectToken);
  const showNew = useSelector(selectShowNewUser);

  const handleCreate = (newUser: FrontUser): void => {
    API.createUser(newUser, newSelf)
      .then(() => {
        notify(newSelf ? 'Account created' : 'User added', {
          severity: 'success',
        });
        dispatch(switchShowNewUser(false));
      })
      .catch((error) => {
        if (error.response?.status === 409)
          notify('Username already exists', { severity: 'error' });
        else {
          notify(error, { severity: 'error' });
          console.error(error);
        }
      });
  };

  return (
    <Modal open={showNew} onClose={() => dispatch(switchShowNewUser(false))}>
      <Box padding={2} display="flex" justifyContent="center">
        <Card className="flex flex-col w-fit m-auto px-15 py-5">
          <CardHeader title="New user" />
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
        </Card>
      </Box>
    </Modal>
  );
}
