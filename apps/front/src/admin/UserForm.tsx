import { type FrontUser, UserRole } from '@website/shared-types';
import { type FormikValues, FormikConfig, Formik, ErrorMessage } from 'formik';
import { type ReactElement } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { type FrontUserDocument } from './utilsAdmin';

type EditProps = { edit: true; create?: never };
type CreateProps = { create: true; edit?: never };
type UserFormProps<T extends FormikValues> = FormikConfig<T> &
  (EditProps | CreateProps) & {
    token: string | undefined;
    userRole: UserRole | undefined;
  };

export default function UserForm<T extends FrontUserDocument | FrontUser>({
  edit,
  create,
  token,
  userRole,
  ...props
}: UserFormProps<T>): ReactElement {
  return (
    <Formik {...props}>
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
              <ErrorMessage name="username">
                {(errorMessage) => (
                  <Form.Control.Feedback type="invalid">
                    {errorMessage}
                  </Form.Control.Feedback>
                )}
              </ErrorMessage>
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
              <ErrorMessage name="password">
                {(errorMessage) => (
                  <Form.Control.Feedback type="invalid">
                    {errorMessage}
                  </Form.Control.Feedback>
                )}
              </ErrorMessage>
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
      )}
    </Formik>
  );
}
