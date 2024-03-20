import { newsSchema, type News } from '@website/shared-types';
import {
  ErrorMessage,
  Formik,
  type FormikConfig,
  type FormikValues,
} from 'formik';
import { type ReactElement } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { type NewsDocument } from './utilsHome';

type EditProps = { edit: true; create?: never };
type CreateProps = { create: true; edit?: never };
type NewsFormProps<T extends FormikValues> = FormikConfig<T> &
  (EditProps | CreateProps);

export default function NewsForm<
  T extends NewsDocument | Omit<News, 'author'>,
>({ edit, create, ...props }: NewsFormProps<T>): ReactElement {
  return (
    <Formik
      validationSchema={toFormikValidationSchema(
        newsSchema.omit({ author: true }),
      )}
      {...props}
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
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={values.title}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter name"
                isInvalid={touched.title && !!errors.title}
              />
              <ErrorMessage name="title">
                {(errorMessage) => (
                  <Form.Control.Feedback type="invalid">
                    {errorMessage}
                  </Form.Control.Feedback>
                )}
              </ErrorMessage>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                type="text"
                name="content"
                value={values.content}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Enter content"
                isInvalid={touched.content && !!errors.content}
              />
              <ErrorMessage name="content">
                {(errorMessage) => (
                  <Form.Control.Feedback type="invalid">
                    {errorMessage}
                  </Form.Control.Feedback>
                )}
              </ErrorMessage>
            </Form.Group>
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
