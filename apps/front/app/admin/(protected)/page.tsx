'use client';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useState, type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { UserRole } from '@website/shared-types';

import { binIcon, editIcon } from '@/app/ui/assets';
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
  const [userToEdit, setUserToEdit] = useState<FrontUserDocument>({
    _id: '',
    username: '',
    password: '',
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
      {users.map((user) => (
        <Grid className="my-3" key={user._id} container>
          <Grid container>
            <Card>
              <CardHeader title={`User: ${user.username}`} />
              <CardContent>
                <Typography>Role: {user.role}</Typography>
              </CardContent>
              <CardActions>
                <Grid>
                  <Grid>
                    <Button
                      onClick={() => {
                        setShowEdit(true);
                        setUserToEdit(user);
                      }}
                    >
                      <Image
                        alt="Edit"
                        src={editIcon}
                        height="24"
                        className="d-inline-block align-center"
                      />
                    </Button>
                  </Grid>
                  <Grid className="d-flex justify-content-end">
                    <Button
                      onClick={() => {
                        setShowConfirm(true);
                        setUserToEdit(user);
                      }}
                    >
                      <Image
                        alt="Delete"
                        src={binIcon}
                        height="24"
                        className="d-inline-block align-center"
                      />
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      ))}
      {userRole === 'superAdmin' && <CreateUserModal />}
      <EditUserModal
        userToEdit={userToEdit}
        show={showEdit}
        setShow={setShowEdit}
      />
    </CustomSuspense>
  );
}
