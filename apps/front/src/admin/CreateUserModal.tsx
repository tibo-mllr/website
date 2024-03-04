import {
  type FrontUser,
  UserRole,
  frontUserSchema,
} from '@website/shared-types';
import { Formik } from 'formik';
import { type ReactElement } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { switchShowNewUser } from 'reducers/slices';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { type FrontUserDocument } from './utilsAdmin';

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

export function CreateUserModal({
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

  const handleCreate = (newUser: FrontUser): void => {
    client
      .post<FrontUserDocument>(`/user${newSelf ? '/new' : ''}`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert(newSelf ? 'Account created' : 'User added');
        setShow(false);
      })
      .catch((error) => {
        if (error.response.status === 409) alert('Username already used');
        else {
          alert(error);
          console.error(error);
        }
      });
  };

  return (
    <Modal show={showNew} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Card.Title>New user</Card.Title>
      </Modal.Header>
      <Formik
        initialValues={emptyUser}
        onSubmit={async (values) => {
          handleCreate(values);
        }}
        validationSchema={toFormikValidationSchema(frontUserSchema)}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={values.username}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter username"
                  isInvalid={touched.username && !!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  isInvalid={touched.password && !!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              {!!token && userRole == 'superAdmin' && (
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={values.role}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    isInvalid={touched.role && !!errors.role}
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
        )}
      </Formik>
    </Modal>
  );
}

export default connector(CreateUserModal);
