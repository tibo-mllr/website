import { type ReactElement } from 'react';
import { Form, type FormControlProps } from 'react-bootstrap';
import { TextField } from './TextField';

type TextFieldProps = Omit<FormControlProps, 'isInvalid' | 'type'> & {
  name: string;
  label: string;
  groupClassName?: string;
};

export function TextFieldWithLabel({
  name,
  label,
  groupClassName,
  ...props
}: TextFieldProps): ReactElement {
  return (
    <Form.Group className={groupClassName}>
      <Form.Label>{label}</Form.Label>
      <TextField name={name} {...props} />
    </Form.Group>
  );
}
