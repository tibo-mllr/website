import { News } from '@website/shared-types';
import {
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ConnectedProps, connect } from 'react-redux';
import { switchShowNewNews } from 'redux/slices';
import { AppState } from 'redux/types';
import { FormErrors, client } from 'utils';

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

export function CreateNews({
  showNew,
  token,
  setShow,
}: ConnectedProps<typeof connector>): ReactElement {
  const emptyNews: News = {
    title: '',
    content: '',
    date: new Date(),
    author: { username: '' },
  };
  const [newNews, setNewNews] = useState<News>(emptyNews);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateForm = useCallback((): FormErrors => {
    const errors: FormErrors = {};

    if (!newNews.title) errors.newtitle = 'Title is required';
    if (!newNews.content) errors.content = 'Content is required';

    return errors;
  }, [newNews]);

  const handleCreate = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateForm();

    if (Object.keys(errors).length > 0) setErrors(errors);
    else {
      client
        .post('/news', newNews, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          alert('News added');
          setNewNews(emptyNews);
          setShow(false);
        })
        .catch((error) => {
          alert(error);
          console.error(error);
        });
      setSubmitted(false);
    }
  };

  useEffect(() => {
    setErrors(validateForm());
  }, [validateForm]);

  return (
    <Modal
      show={showNew}
      onHide={(): void => {
        setShow(false);
        setSubmitted(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add news</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleCreate}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={newNews.title}
              onChange={(event): void =>
                setNewNews({
                  ...newNews,
                  title: event.target.value,
                })
              }
              isValid={!errors.title && !!newNews.title}
              isInvalid={!!errors.title && (!!newNews.title || submitted)}
              placeholder="Enter name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              type="text"
              value={newNews.content}
              onChange={(event): void =>
                setNewNews({
                  ...newNews,
                  content: event.target.value,
                })
              }
              isValid={!errors.content && !!newNews.content}
              isInvalid={!!errors.content && (!!newNews.content || submitted)}
              placeholder="Enter content"
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
    </Modal>
  );
}

export default connector(CreateNews);
