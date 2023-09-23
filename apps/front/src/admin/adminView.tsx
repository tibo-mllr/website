import { UserRole } from '@website/shared-types';
import { binIcon, editIcon } from 'assets';
import { ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { client, socket } from 'utils';
import CreateUser from './createUser';
import EditUser from './editUser';
import { FrontUserDocument } from './utilsAdmin';

type AdminViewProps = {
  showNew: boolean;
  setShowNew: (showNew: boolean) => void;
};

export function AdminView({
  showNew,
  setShowNew,
}: AdminViewProps): ReactElement {
  const [users, setUsers] = useState<FrontUserDocument[]>([]);
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
      client
        .delete(`/user/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
          },
        })
        .then(() => setUsers(users.filter((user) => user._id !== id)))
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    client
      .get<FrontUserDocument[]>(`/user/${sessionStorage.getItem('role')}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
        },
      })
      .then(({ data }) => setUsers(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    socket.on('userAdded', (newUser: FrontUserDocument) =>
      setUsers([...users, newUser]),
    );
    socket.on('userEdited', (editedUser: FrontUserDocument) =>
      setUsers(
        users.map((user) => (user._id === editedUser._id ? editedUser : user)),
      ),
    );
    socket.on('userDeleted', (id: string) =>
      setUsers(users.filter((user) => user._id !== id)),
    );
    return () => {
      socket.off('userAdded');
      socket.off('userEdited');
      socket.off('userDeleted');
    };
  }, [users]);

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
                      onClick={(): void => {
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
                      onClick={(): void => {
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
      {sessionStorage.getItem('role') === 'superAdmin' && (
        <CreateUser
          show={showNew}
          setShow={setShowNew}
          users={users}
          setUsers={setUsers}
        />
      )}
      <EditUser
        userToEdit={userToEdit}
        setUserToEdit={setUserToEdit}
        show={showEdit}
        setShow={setShowEdit}
        users={users}
        setUsers={setUsers}
      />
    </>
  );
}

export default AdminView;
