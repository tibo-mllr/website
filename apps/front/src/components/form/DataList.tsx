import { binIcon } from 'assets';
import { type ReactElement } from 'react';
import {
  Button,
  FloatingLabel,
  Form,
  type FormControlProps,
  InputGroup,
} from 'react-bootstrap';
import { TextField } from './TextFields';

type DataListProps = Omit<FormControlProps, 'isInvalid' | 'type'> & {
  name: string;
  label: string;
  groupClassName?: string;
  listId: string;
  onDeleteOption: () => void;
};

export function DataList({
  name,
  label,
  groupClassName,
  listId,
  onDeleteOption,
  ...props
}: DataListProps): ReactElement {
  return (
    <Form.Group className={groupClassName}>
      <InputGroup>
        <FloatingLabel label={label}>
          <TextField name={name} {...props} list={listId} tooltipError />
        </FloatingLabel>
        <Button onClick={onDeleteOption}>
          <img alt="Bin icon" src={binIcon} height="16" />
        </Button>
      </InputGroup>
    </Form.Group>
  );
}
