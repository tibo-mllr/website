import { TextFieldWithLabel } from '@/components';
import { type OrganizationDocument } from '@/lib/utils';
import { Organization, organizationSchema } from '@website/shared-types';
import { Formik, type FormikValues, type FormikConfig } from 'formik';
import { type ReactElement } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { toFormikValidationSchema } from 'zod-formik-adapter';

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
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <TextFieldWithLabel
              name="name"
              label="Name"
              placeholder="Enter name"
              groupClassName="mb-3"
            />
            <TextFieldWithLabel
              as="textarea"
              name="description"
              label="Description"
              placeholder="Enter description"
              groupClassName="mb-3"
              style={{ height: '20vh' }}
            />
            <TextFieldWithLabel
              name="location"
              label="Location"
              placeholder="Enter location"
              groupClassName="mb-3"
            />
            <TextFieldWithLabel
              name="website"
              label="Website"
              placeholder="Enter website"
              groupClassName="mb-3"
            />
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
