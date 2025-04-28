'use client';

import { Box, Card, CardHeader, Modal } from '@mui/material';
import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { newsSchema, type News } from '@website/shared-types';

import { useNotification } from '@/components/NotificationProvider';
import { API } from '@/lib/api';
import { useAppDispatch } from '@/lib/redux/hooks';
import { selectShowNewNews, switchShowNewNews } from '@/lib/redux/slices';

import NewsForm from './NewsForm';

export default function CreateNewsModal(): ReactElement {
  const emptyNews: Omit<News, 'author'> = {
    title: '',
    content: '',
    date: new Date(),
  };

  const dispatch = useAppDispatch();
  const showNew = useSelector(selectShowNewNews);

  const { notify } = useNotification();

  const handleCreate = (values: Omit<News, 'author'>): void => {
    API.createNews(values)
      .then(() => {
        notify('News added', { severity: 'success' });
        dispatch(switchShowNewNews(false));
      })
      .catch((error) => {
        notify(error, { severity: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal open={showNew} onClose={() => dispatch(switchShowNewNews(false))}>
      <Box
        padding={2}
        width="30vw"
        position="absolute"
        left="50%"
        sx={{ transform: 'translate(-50%, 0)' }}
      >
        <Card>
          <CardHeader title="Create a news" />
          <NewsForm
            create
            initialValues={emptyNews}
            validationSchema={toFormikValidationSchema(
              newsSchema.omit({ author: true }),
            )}
            onSubmit={handleCreate}
          />
        </Card>
      </Box>
    </Modal>
  );
}
