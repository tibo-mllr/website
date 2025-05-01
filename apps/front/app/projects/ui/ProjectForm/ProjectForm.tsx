import {
  Button,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Form, Formik, type FormikConfig, type FormikValues } from 'formik';
import { type ReactElement } from 'react';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { projectSchema, ProjectType } from '@website/shared-types';

import { TextField } from '@/components';
import {
  type OrganizationDocument,
  type Project,
  type ProjectDocument,
} from '@/lib/utils';

import CompetenciesSection from './CompetenciesSection';
import DatesSection from './DatesSection';
import OrganizationSection from './OrganizationSection';

type EditProps = {
  edit: true;
  organization: OrganizationDocument | undefined;
  create?: never;
};
type CreateProps = {
  create: true;
  edit?: never;
  organization?: never;
};
type ProjectFormProps<T extends FormikValues> = FormikConfig<T> &
  (EditProps | CreateProps) & {
    selectEndDate: boolean;
    setSelectEndDate: (selectEndDate: boolean) => void;
    organizations: OrganizationDocument[];
  };

export default function ProjectForm<
  T extends
    | (ProjectDocument & { organization: OrganizationDocument })
    | Project,
>({
  edit,
  organization,
  create,
  selectEndDate,
  setSelectEndDate,
  organizations,
  ...props
}: ProjectFormProps<T>): ReactElement {
  const checkTimeStamp = (begin: Date, end: Date): boolean => {
    begin = new Date(begin);
    end = new Date(end);
    return begin.getTime() <= end.getTime();
  };

  return (
    <Formik
      validationSchema={toFormikValidationSchema(projectSchema)}
      validate={(values) => {
        if (
          values.endDate &&
          !checkTimeStamp(values.startDate, values.endDate)
        ) {
          return { endDate: 'End date must be after start date' };
        }
        return {};
      }}
      {...props}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <CardContent>
            <Grid container spacing={2}>
              <Grid container flexDirection="row" spacing={2} size={12}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    id="role"
                    name="role"
                    label="Role"
                    placeholder="Role (e.g. Developer)"
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    id="title"
                    name="title"
                    label="Title"
                    placeholder="Title (e.g. Project name)"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <FormControl fullWidth>
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  name="type"
                  labelId="type-label"
                  label="Type"
                  value={values.type}
                  onChange={(event) => {
                    if (event.target.value === 'Tech Experiences')
                      setFieldValue(
                        'organization',
                        organization ?? {
                          _id: '',
                          name: '',
                          description: '',
                          location: '',
                          website: '',
                        },
                      );
                    else setFieldValue('organization', undefined);
                    handleChange(event);
                  }}
                >
                  {Object.values(ProjectType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {values.type === ProjectType.TechExperiences && (
                <OrganizationSection organizations={organizations} />
              )}
              <DatesSection
                selectEndDate={selectEndDate}
                setSelectEndDate={setSelectEndDate}
              />
              <Grid container flexDirection="row" spacing={2} size={12}>
                <TextField
                  multiline
                  minRows={4}
                  id="description"
                  name="description"
                  label="Description"
                  placeholder="Description"
                  fullWidth
                />
                <TextField
                  id="link"
                  name="link"
                  label="Link"
                  placeholder="Link"
                />
              </Grid>
              <CompetenciesSection />
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              onClick={() => {
                if (
                  !values.organization?.name &&
                  !values.organization?._id &&
                  !values.organization?.description &&
                  !values.organization?.location &&
                  !values.organization?.website &&
                  values.type !== ProjectType.TechExperiences
                )
                  setFieldValue('organization', undefined);
              }}
              variant="contained"
              className="w-full"
            >
              {edit && 'Edit'}
              {create && 'Add'}
            </Button>
          </CardActions>
        </Form>
      )}
    </Formik>
  );
}
