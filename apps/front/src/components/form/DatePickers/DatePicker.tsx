'use client';

import { formatDate } from 'date-fns';
import { ErrorMessage, useField } from 'formik';
import { type ReactElement } from 'react';
import { Form, type FormControlProps } from 'react-bootstrap';

type DatePickerProps = Omit<FormControlProps, 'isInvalid' | 'type'> & {
  name: string;
  tooltipError?: boolean;
};

export function DatePicker({
  name,
  tooltipError,
  ...props
}: DatePickerProps): ReactElement {
  const [field, meta, helpers] = useField<Date | undefined>(name);

  return (
    <>
      <Form.Control
        {...field}
        {...props}
        type="date"
        value={field.value ? formatDate(field.value, 'yyyy-MM-dd') : ''}
        onChange={(event) => helpers.setValue(new Date(event.target.value))}
        isInvalid={meta.touched && !!meta.error}
      />
      <ErrorMessage name={name}>
        {(errorMessage) => (
          <Form.Control.Feedback type="invalid" tooltip={tooltipError}>
            {errorMessage}
          </Form.Control.Feedback>
        )}
      </ErrorMessage>
    </>
  );
}
