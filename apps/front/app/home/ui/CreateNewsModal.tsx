'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { selectShowNewNews, switchShowNewNews } from '@/lib/redux/slices';
import { client } from '@/lib/utils';
import { newsSchema, type News } from '@website/shared-types';
import { useSnackbar } from 'notistack';
import { type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import NewsForm from './NewsForm';

export default function CreateNewsModal(): ReactElement {
  const emptyNews: Omit<News, 'author'> = {
    title: '',
    content: '',
    date: new Date(),
  };

  const dispatch = useAppDispatch();
  const showNew = useSelector(selectShowNewNews);

  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = (values: Omit<News, 'author'>): void => {
    client
      .post('/news', values)
      .then(() => {
        enqueueSnackbar('News added', { variant: 'success' });
        dispatch(switchShowNewNews(false));
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal show={showNew} onHide={() => dispatch(switchShowNewNews(false))}>
      <Modal.Header closeButton>
        <Modal.Title>Create a news</Modal.Title>
      </Modal.Header>
      <NewsForm
        create
        initialValues={emptyNews}
        validationSchema={toFormikValidationSchema(
          newsSchema.omit({ author: true }),
        )}
        onSubmit={handleCreate}
      />
    </Modal>
  );
}
