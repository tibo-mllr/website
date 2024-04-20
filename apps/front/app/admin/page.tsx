'use client';

import { binIcon, editIcon } from '@/app/ui/assets';
import { ConfirmModal } from '@/components';
import { fetchUsers } from '@/lib/redux/actions';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  addUser,
  deleteUser,
  editUser,
  selectUserRole,
  selectUsers,
} from '@/lib/redux/slices';
import {
  DOCUMENT_TITLE,
  client,
  socket,
  type FrontUserDocument,
} from '@/lib/utils';
import { UserRole } from '@website/shared-types';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import { type ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { CreateUserModal, EditUserModal } from './ui';

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
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    socket.on('userAdded', (newUser: FrontUserDocument) =>
      dispatch(addUser(newUser)),
    );
    socket.on('userEdited', (editedUser: FrontUserDocument) =>
      dispatch(editUser(editedUser)),
    );
    socket.on('userDeleted', (id: string) => dispatch(deleteUser(id)));
    return () => {
      socket.off('userAdded');
      socket.off('userEdited');
      socket.off('userDeleted');
    };
  }, [dispatch]);

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
