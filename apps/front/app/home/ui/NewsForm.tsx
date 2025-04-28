import { Button, CardActions, CardContent, FormGroup } from '@mui/material';
import { Form, Formik, type FormikConfig, type FormikValues } from 'formik';
import { type ReactElement } from 'react';

import { type News } from '@website/shared-types';

import { TextField } from '@/components';
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
        <Form onSubmit={handleSubmit}>
          <CardContent>
            <FormGroup sx={{ gap: 1 }}>
              <TextField
                id="title"
                name="title"
                label="Title"
                placeholder="Enter title"
              />
              <TextField
                multiline
                minRows={4}
                id="content"
                name="content"
                label="Content"
                placeholder="Enter content"
              />
            </FormGroup>
          </CardContent>
          <CardActions>
            <Button variant="contained" type="submit" className="w-full">
              {edit && 'Edit'}
              {create && 'Add'}
            </Button>
          </CardActions>
        </Form>
      )}
    </Formik>
  );
}
