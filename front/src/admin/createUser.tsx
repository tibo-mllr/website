import { FormEvent, ReactElement, useCallback, useState } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { FormErrors, client } from '../utils';
import { Role, User, UserDocument } from './utilsAdmin';

type CreateUserProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  users: UserDocument[];
  setUsers: (users: UserDocument[]) => void;
};

export default function CreateUser({
  show,
  setShow,
  users,
  setUsers,
}: CreateUserProps): ReactElement {
  const [newUser, setNewUser] = useState<User>({
    username: '',
    password: '',
    role: Role.Admin,
  });
  const [erros, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateForm = useCallback((): FormErrors => {
    const errors: FormErrors = {};

    if (!newUser.username) errors.username = 'Username is required';
    if (!newUser.password) errors.password = 'Password is required';

    return errors;
  }, [newUser]);

  const handleCreate = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateForm();

    if (Object.keys(errors).length > 0) setErrors(errors);
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
          setShow(false);
          setUsers([...users, response.data as UserDocument]);
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
      setSubmitted(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={(): void => {
        setShow(false);
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
              isValid={!erros.username && !!newUser.username}
              isInvalid={!!erros.username && (!!newUser.username || submitted)}
              placeholder="Enter username"
            />
            <Form.Control.Feedback type="invalid">
              {erros.username}
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
              isValid={!erros.password && !!newUser.password}
              isInvalid={!!erros.password && (!!newUser.password || submitted)}
              placeholder="Enter password"
              autoComplete="new-password"
            />
            <Form.Control.Feedback type="invalid">
              {erros.password}
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
              {Object.values(Role).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
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
  );
}
