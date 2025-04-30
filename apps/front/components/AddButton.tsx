import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { ReactElement } from 'react';

type AddButtonProps = {
  onClick: () => void;
  text: string;
};

export function AddButton({ onClick, text }: AddButtonProps): ReactElement {
  return (
    <Button onClick={onClick} startIcon={<AddIcon />} variant="text">
      <b>{text}</b>
    </Button>
  );
}
