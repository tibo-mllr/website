import { newsSchema, type News } from '@website/shared-types';
import { Formik } from 'formik';
import { type ReactElement } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { switchShowNewNews } from 'reducers/slices';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const stateProps = (
  state: AppState,
): Pick<
  AppState['newsReducer'] & AppState['adminReducer'],
  'showNew' | 'token'
> => ({
  showNew: state.newsReducer.showNew,
  token: state.adminReducer.token,
});

const dispatchProps = {
  setShow: switchShowNewNews,
};

const connector = connect(stateProps, dispatchProps);

export function CreateNewsModal({
  showNew,
  token,
  setShow,
}: ConnectedProps<typeof connector>): ReactElement {
  const emptyNews: Omit<News, 'author'> = {
    title: '',
    content: '',
    date: new Date(),
  };

  const handleCreate = (values: Omit<News, 'author'>): void => {
    client
      .post('/news', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert('News added');
        setShow(false);
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  };

  return (
    <Modal show={showNew} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Create a news</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={emptyNews}
        validationSchema={toFormikValidationSchema(
          newsSchema.omit({ author: true }),
        )}
        onSubmit={handleCreate}
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
                Add
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default connector(CreateNewsModal);
