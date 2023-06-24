import { ReactElement, FormEvent, useEffect, useState } from 'react';
import { FormErrors, client } from '../utils';
import { News, NewsDocument } from './utilsHome';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import editIcon from '../assets/editIcon.png';
import binIcon from '../assets/binIcon.png';

type HomeViewProps = {
  showNew: boolean;
  setShowNew: (showNew: boolean) => void;
};

export default function HomeView({
  showNew,
  setShowNew,
}: HomeViewProps): ReactElement {
  const [allNews, setAllNews] = useState<NewsDocument[]>([]);
  const [newNews, setNewNews] = useState<News>({
    title: '',
    content: '',
    date: new Date(),
    author: { username: '' },
  });
  const [newErrors, setNewErrors] = useState<FormErrors>({});
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [newsToEdit, setNewsToEdit] = useState<NewsDocument>({
    _id: '',
    title: '',
    content: '',
    date: new Date(),
    author: { username: '' },
  });
  const [editErrors, setEditErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateNewForm = (): FormErrors => {
    const errors: FormErrors = {};

    if (!newNews.title) errors.newtitle = 'Title is required';
    if (!newNews.content) errors.content = 'Content is required';

    return errors;
  };

  const handleCreate = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateNewForm();

    if (Object.keys(errors).length > 0) setNewErrors(errors);
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
          setShowNew(false);
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
      setSubmitted(false);
    }
  };

  const validateEditForm = (): FormErrors => {
    const errors: FormErrors = {};

    if (!newsToEdit.title) errors.newtitle = 'Title is required';
    if (!newsToEdit.content) errors.content = 'Content is required';

    return errors;
  };

  const handleEdit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateEditForm();

    if (Object.keys(errors).length > 0) setEditErrors(errors);
    else {
      client
        .put(`/news/${newsToEdit._id}`, newsToEdit, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
          },
        })
        .then((response) => {
          alert('News edited');
          setAllNews([
            ...allNews.filter((news) => news._id !== newsToEdit._id),
            response.data as NewsDocument,
          ]);
          setShowEdit(false);
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
      setSubmitted(false);
    }
  };

  const handleDelete = (id: string): void => {
    const confirm = window.confirm(
      'Are you sure you want to delete this news ?',
    );
    if (confirm) {
      client
        .delete(`/news/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
          },
        })
        .then(() => {
          setAllNews(allNews.filter((news) => news._id !== id));
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
    }
  };

  useEffect(() => {
    client
      .get('/news')
      .then((response) => setAllNews(response.data as NewsDocument[]))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setNewErrors(validateNewForm());
  }, [newNews]);

  useEffect(() => {
    setEditErrors(validateEditForm());
  }, [newsToEdit]);

  return (
    <>
      {allNews.length ? (
        allNews.map((news) => (
          <Row style={{ paddingBottom: '8px' }} key={news._id}>
            <Col>
              <Card>
                <Card.Header>
                  <Card.Title>{news.title}</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Card.Text>{news.content}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Row>
                    <Col>
                      {new Date(news.date).toLocaleDateString()} by{' '}
                      {news.author.username}
                      {!!news.edited && (
                        <>
                          {' - '}
                          <i>
                            Edited{' '}
                            {!!news.editor ? 'by ' + news.editor.username : ''}
                          </i>
                        </>
                      )}
                    </Col>
                    {!!sessionStorage.getItem('loginToken') &&
                      sessionStorage.getItem('role') == 'superAdmin' && (
                        <Col className="d-flex justify-content-end">
                          <Button
                            onClick={(): void => {
                              setShowEdit(true);
                              setNewsToEdit(news);
                            }}
                            style={{
                              marginRight: '8px',
                            }}
                          >
                            <img
                              alt="Edit"
                              src={editIcon}
                              height="24"
                              className="d-inline-block align-center"
                            />
                          </Button>
                          <Button onClick={(): void => handleDelete(news._id)}>
                            <img
                              alt="Delete"
                              src={binIcon}
                              height="24"
                              className="d-inline-block align-center"
                            />
                          </Button>
                        </Col>
                      )}
                  </Row>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        ))
      ) : (
        <i>Nothing to display</i>
      )}
      {!!sessionStorage.getItem('loginToken') && (
        <Modal
          show={showNew}
          onHide={(): void => {
            setShowNew(false);
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
                  isValid={!newErrors.title && !!newNews.title}
                  isInvalid={
                    !!newErrors.title && (!!newNews.title || submitted)
                  }
                  placeholder="Enter name"
                />
                <Form.Control.Feedback type="invalid">
                  {newErrors.title}
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
                  isValid={!newErrors.content && !!newNews.content}
                  isInvalid={
                    !!newErrors.content && (!!newNews.content || submitted)
                  }
                  placeholder="Enter content"
                />
                <Form.Control.Feedback type="invalid">
                  {newErrors.content}
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
      )}
      {!!sessionStorage.getItem('loginToken') &&
        sessionStorage.getItem('role') === 'superAdmin' && (
          <Modal
            show={showEdit}
            onHide={(): void => {
              setShowEdit(false);
              setSubmitted(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleEdit}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={newsToEdit.title}
                    onChange={(event): void =>
                      setNewsToEdit({
                        ...newsToEdit,
                        title: event.target.value,
                      })
                    }
                    isValid={!editErrors.title && !!newsToEdit.title}
                    isInvalid={
                      !!editErrors.title && (!!newsToEdit.title || submitted)
                    }
                    placeholder="Enter name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.title}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    type="text"
                    value={newsToEdit.content}
                    onChange={(event): void =>
                      setNewsToEdit({
                        ...newsToEdit,
                        content: event.target.value,
                      })
                    }
                    isValid={!editErrors.content && !!newsToEdit.content}
                    isInvalid={
                      !!editErrors.content &&
                      (!!newsToEdit.content || submitted)
                    }
                    placeholder="Enter content"
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.content}
                  </Form.Control.Feedback>
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit">Change</Button>
              </Modal.Footer>
            </Form>
          </Modal>
        )}
    </>
  );
}
