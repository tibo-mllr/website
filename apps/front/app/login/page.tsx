'use client';

import { Button, FormGroup, Grid } from '@mui/material';
import { Form, Formik } from 'formik';
import { type ReactElement } from 'react';

import { TextField } from '@/components';
import { useAuth } from '@/components/AuthProvider';
import { useAppDispatch } from '@/lib/redux/hooks';
import { switchShowNewUser } from '@/lib/redux/slices';

import { CreateUserModal } from '../admin';

export default function LoginView(): ReactElement {
  const dispatch = useAppDispatch();

  const { login } = useAuth();

  return (
    <>
      <Grid padding={2} display="flex" justifyContent="center" width="fit">
        <Formik
          initialValues={{ username: '', password: '' }}
          validate={(values) => {
            const errors: Record<string, string> = {};

            if (!values.username) {
              errors.username = 'Required';
            }
            if (!values.password) {
              errors.password = 'Required';
            }
            return errors;
          }}
          onSubmit={({ username, password }) => login(username, password)}
        >
          {() => (
            <Form>
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
                  type="password"
                  label="Password"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </FormGroup>
              <Grid
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                width="100%"
                marginY={2}
                gap={1}
              >
                <Button type="submit" className="w-full" variant="contained">
                  Connect
                </Button>
                <Button
                  className="w-full"
                  variant="outlined"
                  onClick={() => dispatch(switchShowNewUser(true))}
                >
                  Create account
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
      <CreateUserModal newSelf />
    </>
  );
}
