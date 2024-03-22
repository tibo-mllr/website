import { ErrorMessage, useField } from 'formik';
import { type ReactElement } from 'react';
import { FloatingLabel, Form, type FormControlProps } from 'react-bootstrap';

type PasswordFieldProps = Omit<FormControlProps, 'isInvalid' | 'type'> & {
  name: string;
  groupClassName?: string;
};

export function PasswordField({
  name,
  groupClassName,
  ...props
}: PasswordFieldProps): ReactElement {
  const [field, meta] = useField<string>(name);

  return (
    <Form.Group className={groupClassName}>
      <FloatingLabel label="Password">
        <Form.Control
          {...field}
          {...props}
          type="password"
          isInvalid={meta.touched && !!meta.error}
        />
        <ErrorMessage name={name}>
          {(errorMessage) => (
            <Form.Control.Feedback type="invalid">
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </ErrorMessage>
      </FloatingLabel>
    </Form.Group>
  );
}
