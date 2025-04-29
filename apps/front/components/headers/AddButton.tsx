import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { ReactElement } from 'react';

type AddButtonProps = {
  openModal: () => void;
  text: string;
};

export function AddButton({ openModal, text }: AddButtonProps): ReactElement {
  return (
    <Button onClick={openModal} startIcon={<AddIcon />} variant="text">
      <b>{text}</b>
    </Button>
  );
}
