import { type Organization } from '@website/shared-types';
import { type FormikProps } from 'formik';
import { type ReactElement } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { type OrganizationDocument } from './utilsOrganization';

type EditProps = { edit: true; create?: never };
type CreateProps = { create: true; edit?: never };
type OrganizationFormProps = Pick<
  FormikProps<OrganizationDocument | Organization>,
  | 'values'
  | 'touched'
  | 'errors'
  | 'handleBlur'
  | 'handleChange'
  | 'handleSubmit'
> &
  (EditProps | CreateProps);

export default function OrganizationForm({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  edit,
  create,
}: OrganizationFormProps): ReactElement {
  return (
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
          <Form.Control.Feedback type="invalid">
            {errors.name}
          </Form.Control.Feedback>
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
          <Form.Control.Feedback type="invalid">
            {errors.description}
          </Form.Control.Feedback>
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
          <Form.Control.Feedback type="invalid">
            {errors.location}
          </Form.Control.Feedback>
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
          <Form.Control.Feedback type="invalid">
            {errors.website}
          </Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit">
          {edit && 'Edit'}
          {create && 'Add'}
        </Button>
      </Modal.Footer>
    </Form>
  );
}
