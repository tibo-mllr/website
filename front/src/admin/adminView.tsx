import { FormEvent, ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { User, client, Role, UserDocument } from '../utils';

type AdminViewProps = {
  showNew: boolean;
  setShowNew: (showNew: boolean) => void;
};

export default function AdminView({
  showNew,
  setShowNew,
}: AdminViewProps): ReactElement {
  const [users, setUsers] = useState<UserDocument[]>([]);
  const [newUser, setNewUser] = useState<User>({
    username: '',
    password: '',
    role: Role.Admin,
  });
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<UserDocument>({
    _id: '',
    username: '',
    password: '',
    role: Role.Admin,
  });

  const handleCreate = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    client
      .post('/user', newUser, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
        },
      })
      .then(() => {
        alert('User added');
        setNewUser({
          username: '',
          password: '',
          role: Role.Admin,
        });
        setShowNew(false);
      })
      .catch((error) => alert(error));
  };

  const handleEdit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    client
      .put(`/user/${userToEdit._id}`, userToEdit, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
        },
      })
      .then(() => {
        alert('User edited');
        setShowEdit(false);
      })
      .catch((error) => alert(error));
  };

  const handleDelete = (id: string): void => {
    client
      .delete(`/user/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
        },
      })
      .then(() => {
        alert('User deleted');
        setUsers(users.filter((user) => user._id !== id));
      })
      .catch((error) => alert(error));
  };

  useEffect(() => {
    client
      .get('/user', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
        },
      })
      .then((response) => {
        setUsers(response.data as UserDocument[]);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      {!!sessionStorage.getItem('loginToken') &&
        sessionStorage.getItem('role') == 'superAdmin' &&
        users.map((user) => (
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
                        Edit
                      </Button>
                    </Col>
                    <Col className="d-flex justify-content-end">
                      <Button
                        onClick={(): void => {
                          handleDelete(user._id);
                        }}
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        ))}
      {!!sessionStorage.getItem('loginToken') &&
        sessionStorage.getItem('role') == 'superAdmin' && (
          <Modal show={showNew} onHide={(): void => setShowNew(false)}>
            <Modal.Header closeButton>
              <Card.Title>Add user</Card.Title>
            </Modal.Header>
            <Form onSubmit={handleCreate}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.username}
                    onChange={(event): void =>
                      setNewUser({
                        ...newUser,
                        username: event.target.value,
                      })
                    }
                    placeholder="Enter username"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newUser.password}
                    onChange={(event): void =>
                      setNewUser({
                        ...newUser,
                        password: event.target.value,
                      })
                    }
                    placeholder="Enter password"
                    autoComplete="new-password"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={newUser.role}
                    onChange={(event): void =>
                      setNewUser({
                        ...newUser,
                        role: event.target.value as Role,
                      })
                    }
                  >
                    <option disabled>Select a role</option>
                    <option value={Role.Admin}>Admin</option>
                    <option value={Role.SuperAdmin}>Super admin</option>
                  </Form.Select>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" type="submit">
                  Add
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        )}
      {!!sessionStorage.getItem('loginToken') &&
        sessionStorage.getItem('role') == 'superAdmin' && (
          <Modal show={showEdit} onHide={(): void => setShowEdit(false)}>
            <Modal.Header closeButton>
              <Card.Title>Edit user</Card.Title>
            </Modal.Header>
            <Form onSubmit={handleEdit}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={userToEdit.username}
                    onChange={(event): void =>
                      setUserToEdit({
                        ...userToEdit,
                        username: event.target.value,
                      })
                    }
                    placeholder="Enter username"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={userToEdit.password}
                    onChange={(event): void =>
                      setUserToEdit({
                        ...userToEdit,
                        password: event.target.value,
                      })
                    }
                    placeholder="Enter password"
                    autoComplete="new-password"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={userToEdit.role}
                    onChange={(event): void =>
                      setUserToEdit({
                        ...userToEdit,
                        role: event.target.value as Role,
                      })
                    }
                  >
                    <option disabled>Select a role</option>
                    <option value={Role.Admin}>Admin</option>
                    <option value={Role.SuperAdmin}>Super admin</option>
                  </Form.Select>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" type="submit">
                  Edit
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        )}
    </>
  );
}
