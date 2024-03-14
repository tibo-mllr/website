import { type FrontUser, UserRole } from '@website/shared-types';
import { type FormikProps } from 'formik';
import { type ReactElement } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { connect, type ConnectedProps } from 'react-redux';
import { type AppState } from 'reducers/types';
import { type FrontUserDocument } from './utilsAdmin';

type EditProps = { edit: true; create?: never };
type CreateProps = { create: true; edit?: never };
type UserFormProps = Pick<
  FormikProps<FrontUserDocument | FrontUser>,
  | 'values'
  | 'touched'
  | 'errors'
  | 'handleBlur'
  | 'handleChange'
  | 'handleSubmit'
> &
  (EditProps | CreateProps);

const stateProps = (
  state: AppState,
): Pick<AppState['adminReducer'], 'token' | 'userRole'> => ({
  token: state.adminReducer.token,
  userRole: state.adminReducer.userRole,
});

const connector = connect(stateProps);

function UserForm({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  edit,
  create,
  token,
  userRole,
}: UserFormProps & ConnectedProps<typeof connector>): ReactElement {
  return (
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
          {edit && 'Edit'}
          {create && 'Add'}
        </Button>
      </Modal.Footer>
    </Form>
  );
}

export default connector(UserForm);
