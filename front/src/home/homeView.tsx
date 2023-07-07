import { ReactElement, useEffect, useState } from 'react';
import { client, socket } from '../utils';
import { NewsDocument } from './utilsHome';
import { Button, Card, Col, Row } from 'react-bootstrap';
import editIcon from '../assets/editIcon.png';
import binIcon from '../assets/binIcon.png';
import CreateNews from './createNews';
import EditNews from './editNews';

type HomeViewProps = {
  showNew: boolean;
  setShowNew: (showNew: boolean) => void;
};

export default function HomeView({
  showNew,
  setShowNew,
}: HomeViewProps): ReactElement {
  const [allNews, setAllNews] = useState<NewsDocument[]>([]);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [newsToEdit, setNewsToEdit] = useState<NewsDocument>({
    _id: '',
    title: '',
    content: '',
    date: new Date(),
    author: { username: '' },
  });

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
        .then(() => setAllNews(allNews.filter((news) => news._id !== id)))
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    client
      .get('/news')
      .then((response) => setAllNews(response.data as NewsDocument[]))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    socket.on('newsAdded', (newNews: NewsDocument) =>
      setAllNews([newNews, ...allNews]),
    );
    socket.on('newsEdited', (editedNews: NewsDocument) =>
      setAllNews(
        allNews.map((news) =>
          news._id === editedNews._id ? editedNews : news,
        ),
      ),
    );
    socket.on('newsDeleted', (id: string) =>
      setAllNews(allNews.filter((news) => news._id !== id)),
    );
    socket.on('severalNewsDeleted', () => {
      client
        .get('/news')
        .then((response) => setAllNews(response.data as NewsDocument[]))
        .catch((error) => console.log(error));
    });
    return () => {
      socket.off('newsAdded');
      socket.off('newsEdited');
      socket.off('newsDeleted');
      socket.off('severalNewsDeleted');
    };
  }, [allNews]);

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
                      sessionStorage.getItem('role') === 'superAdmin' && (
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
        <CreateNews
          show={showNew}
          setShow={setShowNew}
          allNews={allNews}
          setAllNews={setAllNews}
        />
      )}
      {!!sessionStorage.getItem('loginToken') &&
        sessionStorage.getItem('role') === 'superAdmin' && (
          <EditNews
            newsToEdit={newsToEdit}
            setNewsToEdit={setNewsToEdit}
            show={showEdit}
            setShow={setShowEdit}
            allNews={allNews}
            setAllNews={setAllNews}
          />
        )}
    </>
  );
}
