'use client';

import { ErrorMessage, useField } from 'formik';
import { type ReactElement } from 'react';
import { Form } from 'react-bootstrap';
import {
  Typeahead,
  type TypeaheadComponentProps,
} from 'react-bootstrap-typeahead';
import { type Option } from 'react-bootstrap-typeahead/types/types';

type TypeaheadFieldProps = Omit<
  TypeaheadComponentProps,
  'isInvalid' | 'onInputChange' | 'onChange' | 'selected' | 'id'
> & {
  name: string;
  label: string;
  onSelected: (selected: Option) => void;
  groupClassName?: string;
};

export function TypeaheadField({
  name,
  label,
  onSelected,
  groupClassName,
  ...props
}: TypeaheadFieldProps): ReactElement {
  const [field, meta, helpers] = useField<string>(name);

  const handleChange = (selected: Option[]): void => {
    if (selected.length) {
      // Don't know why, but it adds an id, and wrecks MongoDB
      delete (selected[0] as Option & { id?: number }).id;
      onSelected(selected[0]);
    }
    helpers.setTouched(true);
  };

  return (
    <Form.Group className={groupClassName}>
      <Form.Label>{label}</Form.Label>
      <Typeahead
        {...field}
        {...props}
        id={name}
        isInvalid={meta.touched && !!meta.error}
        onInputChange={(event) => helpers.setValue(event.target.value)}
        onChange={handleChange}
        defaultSelected={[field.value]}
      />
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
