'use client';

import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { type ReactElement } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

import { PasswordField, TextFieldWithLabel } from '@/components';
import { API } from '@/lib/api';
import { useAppDispatch } from '@/lib/redux/hooks';
import { login, switchShowNewUser } from '@/lib/redux/slices';

import { CreateUserModal } from '../admin';

export default function LoginView(): ReactElement {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { enqueueSnackbar } = useSnackbar();

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
        enqueueSnackbar('Erreur de connexion', { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <>
      <Row>
        <Col
          md={12}
          className="col d-flex flex-column justify-content-center align-items-center"
        >
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
                <Form onSubmit={handleSubmit}>
                  <Card.Body>
                    <TextFieldWithLabel
                      name="username"
                      label="Username"
                      placeholder="Enter username"
                      autoComplete="username"
                    />
                    <PasswordField
                      name="password"
                      placeholder="Enter password"
                      groupClassName="mb-3"
                      autoComplete="current-password"
                    />
                  </Card.Body>
                  <Card.Footer>
                    <Row>
                      <Col>
                        <Button type="submit">Connect</Button>
                      </Col>
                      <Col className="d-flex justify-content-end">
                        <Button
                          onClick={() => dispatch(switchShowNewUser(true))}
                        >
                          Create account
                        </Button>
                      </Col>
                    </Row>
                  </Card.Footer>
                </Form>
              )}
            </Formik>
          </Card>
        </Col>
      </Row>
      <CreateUserModal newSelf />
    </>
  );
}
