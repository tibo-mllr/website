import { UserRole } from '@website/shared-types';
import { binIcon, editIcon } from 'assets';
import { type ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { fetchUsers } from 'reducers/actions';
import { addUser, deleteUser, editUser } from 'reducers/slices';
import { type AppState } from 'reducers/types';
import { DOCUMENT_TITLE, client, socket } from 'utils';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import { type FrontUserDocument } from './utilsAdmin';

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
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<FrontUserDocument>({
    _id: '',
    username: '',
    password: '',
    role: UserRole.Admin,
  });

  const handleDelete = (id: string): void => {
    const confirm = window.confirm(
      'Are you sure you want to delete this user?',
    );
    if (confirm) {
      client.delete(`/user/${id}`).catch((error) => console.error(error));
    }
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
      {users.map((user) => (
        <Row style={{ marginBottom: '8px' }} key={user._id}>
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
                      <img
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
                        handleDelete(user._id);
                      }}
                    >
                      <img
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
