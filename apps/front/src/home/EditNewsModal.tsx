import { useSnackbar } from 'notistack';
import { type ReactElement } from 'react';
import { Modal } from 'react-bootstrap';
import { type ConnectedProps, connect } from 'react-redux';
import { type AppState } from 'reducers/types';
import { client } from 'utils';
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
  const { enqueueSnackbar } = useSnackbar();
  const handleEdit = async (values: NewsDocument): Promise<void> => {
    client
      .put<NewsDocument>(`/news/${newsToEdit._id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
      <NewsForm edit initialValues={newsToEdit} onSubmit={handleEdit} />
    </Modal>
  );
}

export default connector(EditNewsModal);
