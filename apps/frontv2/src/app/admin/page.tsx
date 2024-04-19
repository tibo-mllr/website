'use client';

import { binIcon, editIcon } from '@/assets';
import { ConfirmModal } from '@/components';
import { fetchUsers } from '@/redux/actions';
import { addUser, deleteUser, editUser } from '@/redux/slices';
import { type AppState } from '@/redux/types';
import {
  DOCUMENT_TITLE,
  client,
  socket,
  type FrontUserDocument,
} from '@/utils';
import { UserRole } from '@website/shared-types';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import { type ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';

const stateProps = (
  state: AppState,
): Pick<AppState['adminReducer'], 'users' | 'userRole'> => ({
  users: state.adminReducer.users,
  userRole: state.adminReducer.userRole,
});

const dispatchProps = {
  addUser,
  deleteUser,
  editUser,
  fetchUsers,
};

const connector = connect(stateProps, dispatchProps);

export function AdminView({
  users,
  userRole,
  addUser,
  deleteUser,
  editUser,
  fetchUsers,
}: ConnectedProps<typeof connector>): ReactElement {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<FrontUserDocument>({
    _id: '',
    username: '',
    password: '',
    role: UserRole.Admin,
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = (id: string): void => {
    client
      .delete(`/user/${id}`)
      .then(() => enqueueSnackbar('User deleted', { variant: 'success' }))
      .catch((error) => {
        enqueueSnackbar('Error deleting user', { variant: 'error' });
        console.error(error);
      });
  };

  useEffect(() => {
    document.title = `Admin | ${DOCUMENT_TITLE}`;
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    socket.on('userAdded', (newUser: FrontUserDocument) => addUser(newUser));
    socket.on('userEdited', (editedUser: FrontUserDocument) =>
      editUser(editedUser),
    );
    socket.on('userDeleted', (id: string) => deleteUser(id));
    return () => {
      socket.off('userAdded');
      socket.off('userEdited');
      socket.off('userDeleted');
    };
  }, [addUser, deleteUser, editUser]);

  return (
    <>
      <ConfirmModal
        title="Delete user"
        message="Are you sure you want to delete this user?"
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleDelete(userToEdit._id)}
      />
      {users.map((user) => (
        <Row className="my-3" key={user._id}>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title>User: {user.username}</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Text>Role: {user.role}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <Row>
                  <Col>
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
                  </Col>
                  <Col className="d-flex justify-content-end">
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
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      ))}
      {userRole === 'superAdmin' && <CreateUserModal />}
      <EditUserModal
        userToEdit={userToEdit}
        show={showEdit}
        setShow={setShowEdit}
      />
    </>
  );
}

export default connector(AdminView);
