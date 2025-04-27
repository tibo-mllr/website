import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Modal,
} from '@mui/material';
import { ReactElement } from 'react';

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
    <Modal open={show} onClose={onClose} className="center-modal">
      <Card>
        <CardHeader closeButton className="no-border" title={title} />
        <CardContent>{message}</CardContent>
        <CardActions className="no-border">
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
}
