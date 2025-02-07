import { type ReactElement } from 'react';
import { FloatingLabel, Form, type FormControlProps } from 'react-bootstrap';

import { TextField } from './TextField';

type TextFieldProps = Omit<FormControlProps, 'isInvalid' | 'type'> & {
  name: string;
  label: string;
  groupClassName?: string;
  floating?: boolean;
};

export function TextFieldWithLabel({
  name,
  label,
  groupClassName,
  floating = true,
  ...props
}: TextFieldProps): ReactElement {
  if (floating) {
    return (
      <Form.Group className={groupClassName}>
        <FloatingLabel label={label}>
          <TextField name={name} {...props} />
        </FloatingLabel>
      </Form.Group>
    );
  }

  return (
    <Form.Group className={groupClassName}>
      <Form.Label>{label}</Form.Label>
      <TextField name={name} {...props} />
    </Form.Group>
  );
}
