import { FormEvent, ReactElement, useCallback, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FormErrors, client } from '../utils';
import { News, NewsDocument } from './utilsHome';

type CreateNewsProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  allNews: NewsDocument[];
  setAllNews: (allNews: NewsDocument[]) => void;
};

export default function CreateNews({
  show,
  setShow,
  allNews,
  setAllNews,
}: CreateNewsProps): ReactElement {
  const [newNews, setNewNews] = useState<News>({
    title: '',
    content: '',
    date: new Date(),
    author: { username: '' },
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateForm = useCallback((): FormErrors => {
    const errors: FormErrors = {};

    if (!newNews.title) errors.newtitle = 'Title is required';
    if (!newNews.content) errors.content = 'Content is required';

    return errors;
  }, [newNews]);

  const handleCreate = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateForm();

    if (Object.keys(errors).length > 0) setErrors(errors);
    else {
      client
        .post('/news', newNews, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
          },
        })
        .then((response) => {
          alert('News added');
          setAllNews([response.data as NewsDocument, ...allNews]);
          setNewNews({
            title: '',
            content: '',
            date: new Date(),
            author: { username: '' },
          });
          setShow(false);
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
      setSubmitted(false);
    }
  };

  return (
    <Modal
      show={show}
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
