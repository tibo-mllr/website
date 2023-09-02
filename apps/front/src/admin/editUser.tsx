import {
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { FormErrors, client } from '../utils';
import { Role, UserDocument } from './utilsAdmin';

type EditUserProps = {
  userToEdit: UserDocument;
  setUserToEdit: (userToEdit: UserDocument) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  users: UserDocument[];
  setUsers: (users: UserDocument[]) => void;
};

export default function EditUser({
  userToEdit,
  setUserToEdit,
  show,
  setShow,
  users,
  setUsers,
}: EditUserProps): ReactElement {
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateForm = useCallback((): FormErrors => {
    const errors: FormErrors = {};

    if (!userToEdit.username) errors.username = 'Username is required';

    return errors;
  }, [userToEdit]);

  const handleEdit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateForm();

    if (Object.keys(errors).length > 0) setErrors(errors);
    else {
      client
        .put(`/user/${userToEdit._id}`, userToEdit, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
          },
        })
        .then(() => {
          alert('User edited');
          setUsers(
            users.map((user) =>
              user._id === userToEdit._id ? userToEdit : user,
            ),
          );
          setShow(false);
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
      setSubmitted(false);
    }
  };

  useEffect(() => {
    setErrors(validateForm());
  }, [validateForm]);

  return (
    <Modal
      show={show}
      onHide={(): void => {
        setShow(false);
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
              isValid={!errors.username && !!userToEdit.username}
              isInvalid={
                !!errors.username && (!!userToEdit.username || submitted)
              }
              placeholder="Enter username"
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
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
          {sessionStorage.getItem('role') == 'superAdmin' && (
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
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Edit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
