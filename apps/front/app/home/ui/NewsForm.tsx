import { Button, CardActions, CardContent, TextField } from '@mui/material';
import { Formik, type FormikConfig, type FormikValues } from 'formik';
import { type ReactElement } from 'react';

import { type News } from '@website/shared-types';

import { type NewsDocument } from '@/lib/utils';

type EditProps = { edit: true; create?: never };
type CreateProps = { create: true; edit?: never };
type NewsFormProps<T extends FormikValues> = FormikConfig<T> &
  (EditProps | CreateProps);

export default function NewsForm<
  T extends NewsDocument | Omit<News, 'author'>,
>({ edit, create, ...props }: NewsFormProps<T>): ReactElement {
  return (
    <Formik {...props}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <CardContent>
            <TextField name="title" label="Title" placeholder="Enter title" />
            <TextField
              type="text"
              multiline
              name="content"
              label="Content"
              placeholder="Enter content"
              style={{ height: '20vh' }}
            />
          </CardContent>
          <CardActions>
            <Button variant="contained" type="submit">
              {edit && 'Edit'}
              {create && 'Add'}
            </Button>
          </CardActions>
        </form>
      )}
    </Formik>
  );
}
