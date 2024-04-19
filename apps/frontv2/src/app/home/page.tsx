'use client';

import { binIcon, editIcon } from '@/assets';
import { ConfirmModal } from '@/components';
import { fetchNews } from '@/redux/actions';
import { addNews, deleteNews, editNews } from '@/redux/slices';
import { type AppState } from '@/redux/types';
import { DOCUMENT_TITLE, client, type NewsDocument, socket } from '@/utils';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import { type ReactElement, useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { connect, type ConnectedProps } from 'react-redux';
import { CreateNewsModal, EditNewsModal } from './ui';

const stateProps = (
  state: AppState,
): Pick<
  AppState['newsReducer'] & AppState['adminReducer'],
  'allNews' | 'isLoading' | 'token' | 'userRole'
> => ({
  allNews: state.newsReducer.allNews,
  isLoading: state.newsReducer.isLoading,
  token: state.adminReducer.token,
  userRole: state.adminReducer.userRole,
});

const dispatchProps = {
  addNews,
  deleteNews,
  editNews,
  fetchNews,
};

const connector = connect(stateProps, dispatchProps);

function HomeView({
  allNews,
  isLoading,
  token,
  userRole,
  addNews,
  deleteNews,
  editNews,
  fetchNews,
}: ConnectedProps<typeof connector>): ReactElement {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [newsToEdit, setNewsToEdit] = useState<NewsDocument>({
    _id: '',
    title: '',
    content: '',
    date: new Date(),
    author: { username: '' },
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = (id: string): void => {
    client
      .delete(`/news/${id}`)
      .then(() => enqueueSnackbar('News deleted', { variant: 'success' }))
      .catch((error) => {
        enqueueSnackbar('Error deleting news', { variant: 'error' });
        console.error(error);
      });
  };

  useEffect(() => {
    document.title = `Home | ${DOCUMENT_TITLE}`;
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    socket.on('newsAdded', (newNews: NewsDocument) => addNews(newNews));
    socket.on('newsEdited', (editedNews: NewsDocument) => editNews(editedNews));
    socket.on('newsDeleted', (id: string) => deleteNews(id));
    socket.on('severalNewsDeleted', fetchNews);

    return () => {
      socket.off('newsAdded');
      socket.off('newsEdited');
      socket.off('newsDeleted');
      socket.off('severalNewsDeleted');
    };
  }, [addNews, deleteNews, editNews, fetchNews]);

  if (isLoading) return <i>Loading...</i>;

  return (
    <>
      <ConfirmModal
        title="Delete news"
        message="Are you sure you want to delete this news?"
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleDelete(newsToEdit._id)}
      />
      {allNews.length ? (
        allNews.map((news) => (
          <Row className="my-3" key={news._id}>
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
                    {!!token && userRole === 'superAdmin' && (
                      <Col className="d-flex justify-content-end gap-2">
                        <Button
                          onClick={() => {
                            setShowEdit(true);
                            setNewsToEdit(news);
                          }}
                        >
                          <Image
                            alt="Edit"
                            src={editIcon}
                            height="24"
                            className="d-inline-block align-center"
                          />
                        </Button>
                        <Button
                          onClick={() => {
                            setShowConfirm(true);
                            setNewsToEdit(news);
                          }}
                        >
                          <Image
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
      {!!token && <CreateNewsModal />}
      {!!token && userRole === 'superAdmin' && (
        <EditNewsModal
          newsToEdit={newsToEdit}
          show={showEdit}
          setShow={setShowEdit}
        />
      )}
    </>
  );
}

export default connector(HomeView);
