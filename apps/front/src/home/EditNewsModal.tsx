import { newsSchema } from '@website/shared-types';
import { Formik } from 'formik';
import { type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import NewsForm from './NewsForm';
import { type NewsDocument } from './utilsHome';

type EditNewsProps = {
  newsToEdit: NewsDocument;
  show: boolean;
  setShow: (show: boolean) => void;
};

const stateProps = (
  state: AppState,
): Pick<AppState['adminReducer'], 'token'> => ({
  token: state.adminReducer.token,
});

const connector = connect(stateProps);

export function EditNewsModal({
  newsToEdit,
  show,
  setShow,
  token,
}: EditNewsProps & ConnectedProps<typeof connector>): ReactElement {
  const handleEdit = async (values: NewsDocument): Promise<void> => {
    client
      .put<NewsDocument>(`/news/${newsToEdit._id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert('News edited');
        setShow(false);
      })
      .catch((error) => {
        alert(error);
        console.error(error);
      });
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit news</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={newsToEdit}
        validationSchema={toFormikValidationSchema(
          newsSchema.omit({ author: true, date: true, editor: true }),
        )}
        onSubmit={handleEdit}
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
            edit
          />
        )}
      </Formik>
    </Modal>
  );
}

export default connector(EditNewsModal);
