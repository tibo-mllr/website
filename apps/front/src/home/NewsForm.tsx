import { type News } from '@website/shared-types';
import { type FormikProps } from 'formik';
import { type ReactElement } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { type NewsDocument } from './utilsHome';

type EditProps = { edit: true; create?: never };
type CreateProps = { create: true; edit?: never };
type NewsFormProps = Pick<
  FormikProps<NewsDocument | Omit<News, 'author'>>,
  | 'values'
  | 'touched'
  | 'errors'
  | 'handleBlur'
  | 'handleChange'
  | 'handleSubmit'
> &
  (EditProps | CreateProps);

export default function NewsForm({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  edit,
  create,
}: NewsFormProps): ReactElement {
  return (
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
          <Form.Control.Feedback type="invalid">
            {errors.title}
          </Form.Control.Feedback>
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
          <Form.Control.Feedback type="invalid">
            {errors.content}
          </Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="submit">
          {edit && 'Edit'}
          {create && 'Add'}
        </Button>
      </Modal.Footer>
    </Form>
  );
}
