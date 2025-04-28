'use client';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormGroup,
  Grid,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { type ReactElement } from 'react';

import { TextField } from '@/components';
import { useNotification } from '@/components/NotificationProvider';
import { API } from '@/lib/api';
import { useAppDispatch } from '@/lib/redux/hooks';
import { login, switchShowNewUser } from '@/lib/redux/slices';

import { CreateUserModal } from '../admin';

export default function LoginView(): ReactElement {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { notify } = useNotification();

  const handleSignIn = (values: {
    username: string;
    password: string;
  }): void => {
    API.login(values.username, values.password)
      .then(({ access_token, role }) => {
        dispatch(login({ token: access_token, userRole: role }));
        router.push('/admin');
      })
      .catch((error) => {
        notify('Erreur de connexion', { severity: 'error' });
        console.error(error);
      });
  };

  return (
    <>
      <Grid padding={2} display="flex" justifyContent="center">
        <Card className="flex w-fit m-auto px-15 py-5">
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
            onSubmit={handleSignIn}
          >
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
                      type="password"
                      label="Password"
                      placeholder="Enter password"
                      autoComplete="current-password"
                    />
                  </FormGroup>
                </CardContent>
                <CardActions>
                  <Grid
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    width="100%"
                    gap={1}
                  >
                    <Button
                      type="submit"
                      className="w-full"
                      variant="contained"
                    >
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
                </CardActions>
              </Form>
            )}
          </Formik>
        </Card>
      </Grid>
      <CreateUserModal newSelf />
    </>
  );
}
