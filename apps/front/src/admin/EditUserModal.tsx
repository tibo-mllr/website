import { UserRole, frontUserSchema } from '@website/shared-types';
import { Formik } from 'formik';
import { type ReactElement } from 'react';
import { Button, Card, Form, Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { type FrontUserDocument } from './utilsAdmin';

type EditUserProps = {
  userToEdit: FrontUserDocument;
  show: boolean;
  setShow: (show: boolean) => void;
};

const stateProps = (
  state: AppState,
): Pick<AppState['adminReducer'], 'token' | 'userRole'> => ({
  token: state.adminReducer.token,
  userRole: state.adminReducer.userRole,
});

const connector = connect(stateProps);

export function EditUserModal({
  userToEdit,
  show,
  setShow,
  token,
  userRole,
}: EditUserProps & ConnectedProps<typeof connector>): ReactElement {
  const handleEdit = (values: FrontUserDocument): void => {
    client
      .put(`/user/${userToEdit._id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert('User edited');
        setShow(false);
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  };

  return (
    <Modal
      show={show}
      onHide={(): void => {
        setShow(false);
      }}
    >
      <Modal.Header closeButton>
        <Card.Title>Edit user</Card.Title>
      </Modal.Header>
      <Formik
        initialValues={userToEdit}
        validationSchema={toFormikValidationSchema(
          frontUserSchema.omit({ password: true }).extend({
            password: frontUserSchema.shape.password.optional(),
          }),
        )}
        onSubmit={handleEdit}
      >
        {({
          values,
          touched,
          errors,
          handleBlur,
          handleChange,
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
              {userRole == 'superAdmin' && (
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={values.role}
                    name="role"
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
                Edit
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default connector(EditUserModal);
