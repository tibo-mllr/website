import {
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ConnectedProps, connect } from 'react-redux';
import { AppState } from 'redux/types';
import { FormErrors, client } from 'utils';
import { NewsDocument } from './utilsHome';

type EditNewsProps = {
  newsToEdit: NewsDocument;
  setNewsToEdit: (newsToEdit: NewsDocument) => void;
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
  setNewsToEdit,
  show,
  setShow,
  token,
}: EditNewsProps & ConnectedProps<typeof connector>): ReactElement {
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateForm = useCallback((): FormErrors => {
    const errors: FormErrors = {};

    if (!newsToEdit.title) errors.newtitle = 'Title is required';
    if (!newsToEdit.content) errors.content = 'Content is required';

    return errors;
  }, [newsToEdit]);

  const handleEdit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateForm();

    if (Object.keys(errors).length > 0) setErrors(errors);
    else {
      client
        .put<NewsDocument>(`/news/${newsToEdit._id}`, newsToEdit, {
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
      setSubmitted(false);
    }
  };

  useEffect(() => {
    setErrors(validateForm());
  }, [validateForm]);

  return (
    <Modal
      show={show}
      onHide={(): void => {
        setShow(false);
        setSubmitted(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit news</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleEdit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={newsToEdit.title}
              onChange={(event): void =>
                setNewsToEdit({
                  ...newsToEdit,
                  title: event.target.value,
                })
              }
              isValid={!errors.title && !!newsToEdit.title}
              isInvalid={!!errors.title && (!!newsToEdit.title || submitted)}
              placeholder="Enter name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              type="text"
              value={newsToEdit.content}
              onChange={(event): void =>
                setNewsToEdit({
                  ...newsToEdit,
                  content: event.target.value,
                })
              }
              isValid={!errors.content && !!newsToEdit.content}
              isInvalid={
                !!errors.content && (!!newsToEdit.content || submitted)
              }
              placeholder="Enter content"
            />
            <Form.Control.Feedback type="invalid">
              {errors.content}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">Edit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default connector(EditNewsModal);