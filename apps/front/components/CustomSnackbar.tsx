import { Alert, AlertColor, Snackbar, SnackbarProps } from '@mui/material';
import { type ReactElement } from 'react';

type CustomSnackbarProps = {
  message: string;
  severity: AlertColor;
} & SnackbarProps;

export function CustomSnackbar({
  message,
  severity,
  ...props
}: CustomSnackbarProps): ReactElement {
  return (
    <Snackbar {...props}>
      <Alert severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
