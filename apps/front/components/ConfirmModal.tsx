import {
  Box,
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
    <Modal open={show} onClose={onClose}>
      <Box
        padding={2}
        width="30vw"
        minWidth={300}
        maxHeight="100vh"
        overflow="auto"
        position="absolute"
        left="50%"
        top="50%"
        sx={{ transform: 'translate(-50%, -100%)' }}
      >
        <Card>
          <CardHeader title={title} />
          <CardContent>{message}</CardContent>
          <CardActions sx={{ justifyContent: 'space-between' }}>
            <Button color="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Confirm
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
}
