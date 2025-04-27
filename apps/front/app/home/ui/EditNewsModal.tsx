'use client';

import { Card, CardHeader, Modal } from '@mui/material';
import { type ReactElement } from 'react';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { newsSchema } from '@website/shared-types';

import { useNotification } from '@/components/NotificationProvider';
import { API } from '@/lib/api';
import { type NewsDocument } from '@/lib/utils';

import NewsForm from './NewsForm';

type EditNewsProps = {
  newsToEdit: NewsDocument;
  show: boolean;
  setShow: (show: boolean) => void;
};

export default function EditNewsModal({
  newsToEdit,
  show,
  setShow,
}: EditNewsProps): ReactElement {
  const { notify } = useNotification();
  const handleEdit = async (values: NewsDocument): Promise<void> => {
    API.editNews(newsToEdit._id, values)
      .then(() => {
        notify('News edited', { severity: 'success' });
        setShow(false);
      })
      .catch((error) => {
        notify(error, { severity: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal open={show} onClose={() => setShow(false)}>
      <Card>
        <CardHeader title="Edit news" />
        <NewsForm
          edit
          initialValues={newsToEdit}
          validationSchema={toFormikValidationSchema(
            newsSchema.omit({ author: true, date: true, editor: true }),
          )}
          onSubmit={handleEdit}
        />
      </Card>
    </Modal>
  );
}
