import { useSnackbar, CustomContentProps, SnackbarContent } from 'notistack';
import { forwardRef } from 'react';
import { Alert } from 'react-bootstrap';

export const CustomSnackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  ({ message, variant, id, ...props }, ref) => {
    const { closeSnackbar } = useSnackbar();

    const bootstrapVariant = variant === 'error' ? 'danger' : variant;

    return (
      <SnackbarContent ref={ref} id={id.toString()} {...props}>
        <Alert variant={bootstrapVariant} onClose={closeSnackbar} dismissible>
          {message}
        </Alert>
      </SnackbarContent>
    );
  },
);
