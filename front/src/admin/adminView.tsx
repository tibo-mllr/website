import {
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { FormErrors, client } from '../utils';
import { Role, User, UserDocument } from './utilsAdmin';
import editIcon from '../assets/editIcon.png';
import binIcon from '../assets/binIcon.png';

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
  const [newErros, setNewErrors] = useState<FormErrors>({});
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<UserDocument>({
    _id: '',
    username: '',
    password: '',
    role: Role.Admin,
  });
  const [editErrors, setEditErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateNewForm = useCallback((): FormErrors => {
    const errors: FormErrors = {};

    if (!newUser.username) errors.username = 'Username is required';
    if (!newUser.password) errors.password = 'Password is required';

    return errors;
  }, [newUser]);

  const handleCreate = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateNewForm();

    if (Object.keys(errors).length > 0) setNewErrors(errors);
    else {
      client
        .post('/user', newUser, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
          },
        })
        .then((response) => {
          alert('User added');
          setNewUser({
            username: '',
            password: '',
            role: Role.Admin,
          });
          setShowNew(false);
          setUsers([...users, response.data as UserDocument]);
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
      setSubmitted(false);
    }
  };

  const validateEditForm = useCallback((): FormErrors => {
    const errors: FormErrors = {};

    if (!userToEdit.username) errors.username = 'Username is required';

    return errors;
  }, [userToEdit]);

  const handleEdit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateEditForm();

    if (Object.keys(errors).length > 0) setEditErrors(errors);
    else {
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
        .catch((error) => {
          alert(error);
          console.log(error);
        });
      setSubmitted(false);
    }
  };

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
        .then(() => {
          alert('User deleted');
          setUsers(users.filter((user) => user._id !== id));
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
    }
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
        sessionStorage.getItem('role') === 'superAdmin' && (
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
            <Modal
              show={showNew}
              onHide={(): void => {
                setShowNew(false);
                setSubmitted(false);
                setNewUser({
                  ...newUser,
                  password: '',
                });
              }}
            >
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
                      isValid={!newErros.username && !!newUser.username}
                      isInvalid={
                        !!newErros.username && (!!newUser.username || submitted)
                      }
                      placeholder="Enter username"
                    />
                    <Form.Control.Feedback type="invalid">
                      {newErros.username}
                    </Form.Control.Feedback>
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
                      isValid={!newErros.password && !!newUser.password}
                      isInvalid={
                        !!newErros.password && (!!newUser.password || submitted)
                      }
                      placeholder="Enter password"
                      autoComplete="new-password"
                    />
                    <Form.Control.Feedback type="invalid">
                      {newErros.password}
                    </Form.Control.Feedback>
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
            <Modal
              show={showEdit}
              onHide={(): void => {
                setShowEdit(false);
                setSubmitted(false);
                setUserToEdit({
                  ...userToEdit,
                  password: '',
                });
              }}
            >
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
                      isValid={!editErrors.username && !!userToEdit.username}
                      isInvalid={
                        !!editErrors.username &&
                        (!!userToEdit.username || submitted)
                      }
                      placeholder="Enter username"
                    />
                    <Form.Control.Feedback type="invalid">
                      {editErrors.username}
                    </Form.Control.Feedback>
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
          </>
        )}
    </>
  );
}
