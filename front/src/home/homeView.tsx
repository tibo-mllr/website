import { ReactElement, FormEvent, useEffect, useState } from 'react';
import { client } from '../utils';
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
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [newsToEdit, setNewsToEdit] = useState<NewsDocument>({
    _id: '',
    title: '',
    content: '',
    date: new Date(),
    author: { username: '' },
  });

  const handleCreate = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

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
  };

  const handleEdit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

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
      {!!sessionStorage.getItem('loginToken') &&
        sessionStorage.getItem('role') === 'superAdmin' && (
          <Modal show={showEdit} onHide={(): void => setShowEdit(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleEdit}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newsToEdit.title}
                    onChange={(event): void =>
                      setNewsToEdit({
                        ...newsToEdit,
                        title: event.target.value,
                      })
                    }
                    placeholder="Enter name"
                  />
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
                    placeholder="Enter content"
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit">Change</Button>
              </Modal.Footer>
            </Form>
          </Modal>
        )}
      {!!sessionStorage.getItem('loginToken') && (
        <Modal show={showNew} onHide={(): void => setShowNew(false)}>
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
                  placeholder="Enter name"
                />
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
                  placeholder="Enter content"
                />
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
    </>
  );
}
