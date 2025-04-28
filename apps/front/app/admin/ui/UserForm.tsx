import {
  Button,
  CardActions,
  CardContent,
  FormGroup,
  MenuItem,
  Select,
} from '@mui/material';
import { Form, Formik, type FormikConfig, type FormikValues } from 'formik';
import { type ReactElement } from 'react';

import { UserRole, type FrontUser } from '@website/shared-types';

import { TextField } from '@/components';
import { type FrontUserDocument } from '@/lib/utils';

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
      {() => (
        <Form>
          <CardContent>
            <FormGroup sx={{ gap: 1 }}>
              <TextField
                id="username"
                name="username"
                label="Username"
                placeholder="Enter username"
                autoComplete="username"
              />
              <TextField
                id="password"
                name="password"
                label="Password"
                type="password"
                placeholder="Enter password"
                autoComplete="new-password"
              />
              {!!token && userRole == 'superAdmin' && (
                <Select name="role" label="Role">
                  {Object.values(UserRole).map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormGroup>
          </CardContent>
          <CardActions>
            <Button type="submit" variant="contained" className="w-full">
              {edit && 'Edit'}
              {create && 'Create account'}
            </Button>
          </CardActions>
        </Form>
      )}
    </Formik>
  );
}
