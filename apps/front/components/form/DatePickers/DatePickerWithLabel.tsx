import { type ReactElement } from 'react';
import { Form, type FormControlProps } from 'react-bootstrap';

import { DatePicker } from './DatePicker';

type DatePickerProps = Omit<FormControlProps, 'isInvalid' | 'type'> & {
  name: string;
  label: string;
  groupClassName?: string;
};

export function DatePickerWithLabel({
  name,
  label,
  groupClassName,
  ...props
}: DatePickerProps): ReactElement {
  return (
    <Form.Group className={groupClassName}>
      <Form.Label>{label}</Form.Label>
      <DatePicker name={name} {...props} />
    </Form.Group>
  );
}
