import { type ReactElement } from 'react';
import {
  Button,
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
      <Form.Label>{label}</Form.Label>
      <InputGroup>
        <TextField name={name} {...props} list={listId} tooltipError />
        <Button onClick={onDeleteOption}>Delete</Button>
      </InputGroup>
    </Form.Group>
  );
}
