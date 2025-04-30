'use client';

import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useEffect, useState, type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { ConfirmModal, CustomSuspense, NewsCardSkeleton } from '@/components';
import { useNotification } from '@/components/NotificationProvider';
import { API } from '@/lib/api';
import { fetchNews } from '@/lib/redux/actions';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  addNews,
  deleteNews,
  editNews,
  selectNews,
  selectNewsLoading,
  selectToken,
  selectUserRole,
} from '@/lib/redux/slices';
import { type NewsDocument } from '@/lib/utils';

import { CreateNewsModal, EditNewsModal } from './ui';

export default function HomeView(): ReactElement {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [newsToEdit, setNewsToEdit] = useState<NewsDocument>({
    _id: '',
    title: '',
    content: '',
    date: new Date(),
    author: { username: '' },
  });

  const dispatch = useAppDispatch();
  const token = useSelector(selectToken);
  const userRole = useSelector(selectUserRole);
  const allNews = useSelector(selectNews);
  const isLoading = useSelector(selectNewsLoading);

  const { notify } = useNotification();

  const handleDelete = (id: string): void => {
    API.deleteNews(id)
      .then(() => notify('News deleted', { severity: 'success' }))
      .catch((error) => {
        notify('Error deleting news', { severity: 'error' });
        console.error(error);
      });
  };

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  useEffect(() => {
    API.listenTo('newsAdded', (newNews: NewsDocument) =>
      dispatch(addNews(newNews)),
    );
    API.listenTo('newsEdited', (editedNews: NewsDocument) =>
      dispatch(editNews(editedNews)),
    );
    API.listenTo('newsDeleted', (id: string) => dispatch(deleteNews(id)));
    API.listenTo('severalNewsDeleted', () => dispatch(fetchNews()));

    return () => {
      API.stopListening('newsAdded');
      API.stopListening('newsEdited');
      API.stopListening('newsDeleted');
      API.stopListening('severalNewsDeleted');
    };
  }, [dispatch]);

  return (
    <CustomSuspense
      fallback={<NewsCardSkeleton />}
      count={3}
      isLoading={isLoading}
    >
      <ConfirmModal
        title="Delete news"
        message="Are you sure you want to delete this news?"
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleDelete(newsToEdit._id)}
      />
      {allNews.length ? (
        allNews.map((news) => (
          <Card key={news._id} className="my-3">
            <CardHeader title={news.title} />
            <CardContent>
              <Typography>{news.content}</Typography>
            </CardContent>
            <CardActions>
              <Grid container alignItems="center" width="100%">
                <Grid>
                  {new Date(news.date).toLocaleDateString()} by{' '}
                  {news.author.username}
                  {!!news.edited && (
                    <>
                      {' - '}
                      <i>
                        Edited {news.editor ? 'by ' + news.editor.username : ''}
                      </i>
                    </>
                  )}
                </Grid>
                {!!token && userRole === 'superAdmin' && (
                  <Grid className="ms-auto justify-content-end" display="flex">
                    <IconButton
                      aria-label="Edit"
                      onClick={() => {
                        setShowEdit(true);
                        setNewsToEdit(news);
                      }}
                      color="warning"
                    >
                      <EditTwoToneIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Delete"
                      onClick={() => {
                        setShowConfirm(true);
                        setNewsToEdit(news);
                      }}
                      color="error"
                    >
                      <DeleteForeverTwoToneIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </CardActions>
          </Card>
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
    </CustomSuspense>
  );
}
