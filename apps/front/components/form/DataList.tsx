import {
  Button,
  FormControl,
  FormGroup,
  TextField,
  TextFieldProps,
} from '@mui/material';
import Image from 'next/image';
import { type ReactElement } from 'react';

import { binIcon } from '@/app/ui/assets';

type DataListProps = Omit<TextFieldProps, 'name'> & {
  name: string;
  label: string;
  groupClassName?: string;
  onDeleteOption: () => void;
};

export function DataList({
  name,
  label,
  groupClassName,
  onDeleteOption,
  ...props
}: DataListProps): ReactElement {
  return (
    <FormGroup className={groupClassName}>
      <FormControl>
        <TextField name={name} label={label} {...props} />
        <Button onClick={onDeleteOption}>
          <Image alt="Bin icon" src={binIcon} height="16" />
        </Button>
      </FormControl>
    </FormGroup>
  );
}
