import {
  Button,
  CardActions,
  CardContent,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Formik, type FormikConfig, type FormikValues } from 'formik';
import { type ReactElement } from 'react';

import { UserRole, type FrontUser } from '@website/shared-types';

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
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <CardContent>
            <TextField
              name="username"
              label="Username"
              placeholder="Enter username"
              autoComplete="username"
            />
            <TextField
              name="password"
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
          </CardContent>
          <CardActions>
            <Button variant="contained" type="submit">
              {edit && 'Edit'}
              {create && 'Add'}
            </Button>
          </CardActions>
        </form>
      )}
    </Formik>
  );
}
