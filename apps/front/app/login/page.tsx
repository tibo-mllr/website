'use client';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
} from '@mui/material';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { type ReactElement } from 'react';

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
      <Grid>
        <Grid className="col d-flex flex-column justify-content-center align-items-center">
          <Card className="w-50 mt-5">
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
                      autoComplete="current-password"
                    />
                  </CardContent>
                  <CardActions>
                    <Grid>
                      <Grid>
                        <Button type="submit">Connect</Button>
                      </Grid>
                      <Grid className="d-flex justify-content-end">
                        <Button
                          onClick={() => dispatch(switchShowNewUser(true))}
                        >
                          Create account
                        </Button>
                      </Grid>
                    </Grid>
                  </CardActions>
                </form>
              )}
            </Formik>
          </Card>
        </Grid>
      </Grid>
      <CreateUserModal newSelf />
    </>
  );
}
