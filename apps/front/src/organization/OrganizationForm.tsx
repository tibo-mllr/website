import { Organization, organizationSchema } from '@website/shared-types';
import {
  ErrorMessage,
  Formik,
  type FormikValues,
  type FormikConfig,
} from 'formik';
import { type ReactElement } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { type OrganizationDocument } from './utilsOrganization';

type EditProps = { edit: true; create?: never };
type CreateProps = { create: true; edit?: never };
type OrganizationFormProps<T extends FormikValues> = FormikConfig<T> &
  (EditProps | CreateProps);

export default function OrganizationForm<
  T extends OrganizationDocument | Organization,
>({ edit, create, ...props }: OrganizationFormProps<T>): ReactElement {
  return (
    <Formik
      validationSchema={toFormikValidationSchema(organizationSchema)}
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
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
                isInvalid={touched.name && !!errors.name}
                placeholder="Enter name"
              />
              <ErrorMessage name="name">
                {(errorMessage) => (
                  <Form.Control.Feedback type="invalid">
                    {errorMessage}
                  </Form.Control.Feedback>
                )}
              </ErrorMessage>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                isInvalid={touched.description && !!errors.description}
                placeholder="Enter name"
              />
              <ErrorMessage name="description">
                {(errorMessage) => (
                  <Form.Control.Feedback type="invalid">
                    {errorMessage}
                  </Form.Control.Feedback>
                )}
              </ErrorMessage>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={values.location}
                onBlur={handleBlur}
                onChange={handleChange}
                isInvalid={touched.location && !!errors.location}
                placeholder="Enter content"
              />
              <ErrorMessage name="location">
                {(errorMessage) => (
                  <Form.Control.Feedback type="invalid">
                    {errorMessage}
                  </Form.Control.Feedback>
                )}
              </ErrorMessage>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="text"
                name="website"
                value={values.website}
                onBlur={handleBlur}
                onChange={handleChange}
                isInvalid={touched.website && !!errors.website}
                placeholder="Enter content"
              />
              <ErrorMessage name="website">
                {(errorMessage) => (
                  <Form.Control.Feedback type="invalid">
                    {errorMessage}
                  </Form.Control.Feedback>
                )}
              </ErrorMessage>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">
              {edit && 'Edit'}
              {create && 'Add'}
            </Button>
          </Modal.Footer>
        </Form>
      )}
    </Formik>
  );
}
