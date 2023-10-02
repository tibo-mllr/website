import { FrontUser, UserRole } from '@website/shared-types';
import {
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { ConnectedProps, connect } from 'react-redux';
import { switchShowNewUser } from 'redux/slices';
import { AppState } from 'redux/types';
import { FormErrors, client } from 'utils';
import { FrontUserDocument } from './utilsAdmin';

type CreateUserProps = {
  newSelf?: boolean;
};

const stateProps = (
  state: AppState,
): Pick<AppState['adminReducer'], 'showNew' | 'token' | 'userRole'> => ({
  showNew: state.adminReducer.showNew,
  token: state.adminReducer.token,
  userRole: state.adminReducer.userRole,
});

const dispatchProps = { setShow: switchShowNewUser };

const connector = connect(stateProps, dispatchProps);

export function CreateUser({
  showNew,
  setShow,
  token,
  userRole,
  newSelf = false,
}: CreateUserProps & ConnectedProps<typeof connector>): ReactElement {
  const emptyUser: FrontUser = {
    username: '',
    password: '',
    role: UserRole.Admin,
  };
  const [newUser, setNewUser] = useState<FrontUser>(emptyUser);
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
        .post<FrontUserDocument>(`/user${newSelf ? '/new' : ''}`, newUser, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          alert(newSelf ? 'Account created' : 'User added');
          setNewUser(emptyUser);
          setShow(false);
        })
        .catch((error) => {
          if (error.response.status === 409) alert('Username already used');
          else {
            alert(error);
            console.error(error);
          }
        });
      setSubmitted(false);
    }
  };

  useEffect(() => {
    setErrors(validateForm());
  }, [validateForm]);

  return (
    <Modal
      show={showNew}
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
          {!!token && userRole == 'superAdmin' && (
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={newUser.role}
                onChange={(event): void =>
                  setNewUser({
                    ...newUser,
                    role: event.target.value as UserRole,
                  })
                }
              >
                <option disabled>Select a role</option>
                {Object.values(UserRole).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
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

export default connector(CreateUser);
