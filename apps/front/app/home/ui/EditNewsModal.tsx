'use client';

import { API } from '@/lib/api';
import { type NewsDocument } from '@/lib/utils';
import { newsSchema } from '@website/shared-types';
import { useSnackbar } from 'notistack';
import { type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import { toFormikValidationSchema } from 'zod-formik-adapter';
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
  const { enqueueSnackbar } = useSnackbar();
  const handleEdit = async (values: NewsDocument): Promise<void> => {
    API.editNews(newsToEdit._id, values)
      .then(() => {
        enqueueSnackbar('News edited', { variant: 'success' });
        setShow(false);
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit news</Modal.Title>
      </Modal.Header>
      <NewsForm
        edit
        initialValues={newsToEdit}
        validationSchema={toFormikValidationSchema(
          newsSchema.omit({ author: true, date: true, editor: true }),
        )}
        onSubmit={handleEdit}
      />
    </Modal>
  );
}
