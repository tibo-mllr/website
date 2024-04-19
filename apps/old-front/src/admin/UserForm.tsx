import { type FrontUser, UserRole } from '@website/shared-types';
import {
  PasswordField,
  SelectFieldWithLabel,
  TextFieldWithLabel,
} from 'components';
import { type FormikValues, type FormikConfig, Formik } from 'formik';
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
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <TextFieldWithLabel
              name="username"
              label="Username"
              placeholder="Enter username"
              autoComplete="username"
              groupClassName="mb-3"
            />
            <PasswordField
              name="password"
              placeholder="Enter password"
              autoComplete="new-password"
              groupClassName="mb-3"
            />
            {!!token && userRole == 'superAdmin' && (
              <SelectFieldWithLabel
                name="role"
                label="Role"
                options={Object.values(UserRole)}
                groupClassName="mb-3"
              />
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
