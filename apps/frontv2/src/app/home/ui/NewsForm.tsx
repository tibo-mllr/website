import { TextFieldWithLabel } from '@/components';
import { type NewsDocument } from '@/utils';
import { type News } from '@website/shared-types';
import { Formik, type FormikConfig, type FormikValues } from 'formik';
import { type ReactElement } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

type EditProps = { edit: true; create?: never };
type CreateProps = { create: true; edit?: never };
type NewsFormProps<T extends FormikValues> = FormikConfig<T> &
  (EditProps | CreateProps);

export default function NewsForm<
  T extends NewsDocument | Omit<News, 'author'>,
>({ edit, create, ...props }: NewsFormProps<T>): ReactElement {
  return (
    <Formik {...props}>
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <TextFieldWithLabel
              name="title"
              label="Title"
              placeholder="Enter title"
              groupClassName="mb-3"
            />
            <TextFieldWithLabel
              as="textarea"
              name="content"
              label="Content"
              placeholder="Enter content"
              groupClassName="mb-3"
              style={{ height: '20vh' }}
            />
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
