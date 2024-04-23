'use client';

import { ErrorMessage, useField } from 'formik';
import { type ReactElement } from 'react';
import { Form, type FormControlProps } from 'react-bootstrap';

type TextFieldProps = Omit<FormControlProps, 'isInvalid' | 'type'> & {
  name: string;
  tooltipError?: boolean;
};

export function TextField({
  name,
  tooltipError,
  ...props
}: TextFieldProps): ReactElement {
  const [field, meta] = useField<string>(name);

  return (
    <>
      <Form.Control
        {...field}
        {...props}
        type="text"
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
