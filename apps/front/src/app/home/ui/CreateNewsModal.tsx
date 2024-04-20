'use client';

import { switchShowNewNews } from '@/lib/redux/slices';
import { type AppState } from '@/lib/redux/types';
import { client } from '@/lib/utils';
import { newsSchema, type News } from '@website/shared-types';
import { useSnackbar } from 'notistack';
import { type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import NewsForm from './NewsForm';

const stateProps = (
  state: AppState,
): Pick<AppState['newsReducer'], 'showNew'> => ({
  showNew: state.newsReducer.showNew,
});

const dispatchProps = {
  setShow: switchShowNewNews,
};

const connector = connect(stateProps, dispatchProps);

export function CreateNewsModal({
  showNew,
  setShow,
}: ConnectedProps<typeof connector>): ReactElement {
  const emptyNews: Omit<News, 'author'> = {
    title: '',
    content: '',
    date: new Date(),
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleCreate = (values: Omit<News, 'author'>): void => {
    client
      .post('/news', values)
      .then(() => {
        enqueueSnackbar('News added', { variant: 'success' });
        setShow(false);
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: 'error' });
        console.error(error);
      });
  };

  return (
    <Modal show={showNew} onHide={() => setShow(false)}>
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

export default connector(CreateNewsModal);
