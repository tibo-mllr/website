import { newsSchema, type News } from '@website/shared-types';
import { Formik } from 'formik';
import { type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { switchShowNewNews } from 'reducers/slices';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import NewsForm from './NewsForm';

const stateProps = (
  state: AppState,
): Pick<
  AppState['newsReducer'] & AppState['adminReducer'],
  'showNew' | 'token'
> => ({
  showNew: state.newsReducer.showNew,
  token: state.adminReducer.token,
});

const dispatchProps = {
  setShow: switchShowNewNews,
};

const connector = connect(stateProps, dispatchProps);

export function CreateNewsModal({
  showNew,
  token,
  setShow,
}: ConnectedProps<typeof connector>): ReactElement {
  const emptyNews: Omit<News, 'author'> = {
    title: '',
    content: '',
    date: new Date(),
  };

  const handleCreate = (values: Omit<News, 'author'>): void => {
    client
      .post('/news', values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert('News added');
        setShow(false);
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  };

  return (
    <Modal show={showNew} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Create a news</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={emptyNews}
        validationSchema={toFormikValidationSchema(
          newsSchema.omit({ author: true }),
        )}
        onSubmit={handleCreate}
      >
        {({
          values,
          touched,
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <NewsForm
            values={values}
            touched={touched}
            errors={errors}
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            create
          />
        )}
      </Formik>
    </Modal>
  );
}

export default connector(CreateNewsModal);
