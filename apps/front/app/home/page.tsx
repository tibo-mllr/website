'use client';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useState, type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { binIcon, editIcon } from '@/app/ui/assets';
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
          <Grid container className="my-3" key={news._id}>
            <Grid>
              <Card>
                <CardHeader title={news.title} />
                <CardContent>
                  <Typography>{news.content}</Typography>
                </CardContent>
                <CardActions>
                  <Grid container>
                    <Grid>
                      {new Date(news.date).toLocaleDateString()} by{' '}
                      {news.author.username}
                      {!!news.edited && (
                        <>
                          {' - '}
                          <i>
                            Edited{' '}
                            {news.editor ? 'by ' + news.editor.username : ''}
                          </i>
                        </>
                      )}
                    </Grid>
                    {!!token && userRole === 'superAdmin' && (
                      <Grid className="d-flex justify-content-end gap-2">
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
                      </Grid>
                    )}
                  </Grid>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
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
