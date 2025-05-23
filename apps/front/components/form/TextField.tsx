'use client';

import {
  TextField as MUITextField,
  TextFieldProps as MUITextFieldProps,
} from '@mui/material';
import { useField } from 'formik';
import { type ReactElement } from 'react';

type TextFieldProps = Omit<MUITextFieldProps, 'error' | 'helperText'>;

export function TextField({ name, ...props }: TextFieldProps): ReactElement {
  const [field, meta] = useField<string>(name);

  return (
    <MUITextField
      // @ts-expect-error Default value to not change between controlled and uncontrolled
      value={''}
      {...field}
      {...props}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
}
