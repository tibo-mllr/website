import { ReactElement } from 'react';
import { Button, Modal } from 'react-bootstrap';

type ConfirmModalProps = {
  title: string;
  message: string;
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  title,
  message,
  show,
  onClose,
  onConfirm,
}: ConfirmModalProps): ReactElement {
  return (
    <Modal show={show} onHide={onClose} className="confirm-modal">
      <Modal.Header closeButton className="no-border">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer className="no-border">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
