'use client';

import { ErrorMessage, useField } from 'formik';
import { type ReactElement } from 'react';
import { Form, type FormSelectProps } from 'react-bootstrap';

type SelectFieldProps = Omit<FormSelectProps, 'isInvalid'> & {
  name: string;
  label: string;
  groupClassName?: string;
  helperOption?: string;
  options: string[];
};

export function SelectFieldWithLabel({
  name,
  label,
  groupClassName,
  helperOption,
  options,
  ...props
}: SelectFieldProps): ReactElement {
  const [field, meta] = useField<string>(name);

  return (
    <Form.Group className={groupClassName}>
      <Form.Label>{label}</Form.Label>
      <Form.Select
        {...field}
        {...props}
        isInvalid={meta.touched && !!meta.error}
      >
        {!!helperOption && <option disabled>{helperOption}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Form.Select>
      <ErrorMessage name={name}>
        {(errorMessage) => (
          <Form.Control.Feedback type="invalid">
            {errorMessage}
          </Form.Control.Feedback>
        )}
      </ErrorMessage>
    </Form.Group>
  );
}
