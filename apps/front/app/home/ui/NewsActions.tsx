'use client';

import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import { Grid, IconButton } from '@mui/material';
import { ReactElement, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { ConfirmModal, useNotification } from '@/components';
import { API } from '@/lib/api';
import { selectToken, selectUserRole } from '@/lib/redux/slices';
import { NewsDocument } from '@/lib/utils';

import EditNewsModal from './EditNewsModal';

type NewsActionsProps = {
  news: NewsDocument;
};

export default function NewsActions({ news }: NewsActionsProps): ReactElement {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newsToEdit, setNewsToEdit] = useState<NewsDocument>({
    _id: '',
    title: '',
    content: '',
    date: new Date(),
    author: { username: '' },
  });

  const token = useSelector(selectToken);
  const userRole = useSelector(selectUserRole);

  const { notify } = useNotification();

  const handleDelete = useCallback<(id: string) => void>(
    (id) => {
      API.deleteNews(id)
        .then(() => notify('News deleted', { severity: 'success' }))
        .catch((error) => {
          notify('Error deleting news', { severity: 'error' });
          console.error(error);
        });
    },
    [notify],
  );

  if (!token) return <></>;

  return (
    <>
      <ConfirmModal
        title="Delete news"
        message="Are you sure you want to delete this news?"
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => handleDelete(newsToEdit._id)}
      />
      {userRole === 'superAdmin' && (
        <>
          <EditNewsModal
            newsToEdit={newsToEdit}
            show={showEdit}
            setShow={setShowEdit}
          />

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
        </>
      )}
    </>
  );
}
