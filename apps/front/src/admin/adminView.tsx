import { ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import binIcon from '../assets/binIcon.png';
import editIcon from '../assets/editIcon.png';
import { client, socket } from '../utils';
import CreateUser from './createUser';
import EditUser from './editUser';
import { Role, UserDocument } from './utilsAdmin';

type AdminViewProps = {
  showNew: boolean;
  setShowNew: (showNew: boolean) => void;
};

export default function AdminView({
  showNew,
  setShowNew,
}: AdminViewProps): ReactElement {
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<UserDocument>({
    _id: '',
    username: '',
    password: '',
    role: Role.Admin,
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
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    client
      .get(`/user/${sessionStorage.getItem('role')}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
        },
      })
      .then((response) => setUsers(response.data as UserDocument[]))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    socket.on('userAdded', (newUser: UserDocument) =>
      setUsers([...users, newUser]),
    );
    socket.on('userEdited', (editedUser: UserDocument) =>
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
                  {sessionStorage.getItem('id') !== user._id && (
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
                  )}
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