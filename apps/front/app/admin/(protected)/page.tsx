'use client';

import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useEffect, useState, type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { UserRole } from '@website/shared-types';

import {
  ConfirmModal,
  CustomSuspense,
  useNotification,
  UserCardSkeleton,
} from '@/components';
import { API } from '@/lib/api';
import { fetchUsers } from '@/lib/redux/actions';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  addUser,
  deleteUser,
  editUser,
  selectUserRole,
  selectUsers,
  selectUsersLoading,
} from '@/lib/redux/slices';
import { type FrontUserDocument } from '@/lib/utils';

import { CreateUserModal, EditUserModal } from '../ui';

export default function AdminView(): ReactElement {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<
    Omit<FrontUserDocument, 'password'>
  >({
    _id: '',
    username: '',
    role: UserRole.Admin,
  });

  const dispatch = useAppDispatch();
  const userRole = useSelector(selectUserRole);
  const users = useSelector(selectUsers);
  const isLoading = useSelector(selectUsersLoading);

  const { notify } = useNotification();

  const handleDelete = (id: string): void => {
    API.deleteUser(id)
      .then(() => notify('User deleted', { severity: 'success' }))
      .catch((error) => {
        notify('Error deleting user', { severity: 'error' });
        console.error(error);
      });
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    API.listenTo('userAdded', (newUser: FrontUserDocument) =>
      dispatch(addUser(newUser)),
    );
    API.listenTo('userEdited', (editedUser: FrontUserDocument) =>
      dispatch(editUser(editedUser)),
    );
    API.listenTo('userDeleted', (id: string) => dispatch(deleteUser(id)));
    return () => {
      API.stopListening('userAdded');
      API.stopListening('userEdited');
      API.stopListening('userDeleted');
    };
  }, [dispatch]);

  return (
    <CustomSuspense fallback={<UserCardSkeleton />} isLoading={isLoading}>
      <ConfirmModal
        title="Delete user"
        message="Are you sure you want to delete this user?"
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleDelete(userToEdit._id)}
      />
      <Grid container columns={{ xs: 4, sm: 9, md: 12 }} spacing={3}>
        {users.map((user) => (
          <Grid key={user._id} size={{ xs: 2, sm: 3, md: 3 }}>
            <Card className="my-3">
              <CardHeader title={`User: ${user.username}`} />
              <CardContent>
                <Typography>Role: {user.role}</Typography>
              </CardContent>
              <CardActions>
                <Grid
                  display="flex"
                  width="100%"
                  justifyContent="space-between"
                >
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
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {userRole === 'superAdmin' && <CreateUserModal />}
      <EditUserModal
        userToEdit={userToEdit}
        show={showEdit}
        setShow={setShowEdit}
      />
    </CustomSuspense>
  );
}
