import {
  Button,
  CardActions,
  CardContent,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Formik, type FormikConfig, type FormikValues } from 'formik';
import { type ReactElement } from 'react';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { projectSchema, ProjectType } from '@website/shared-types';

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
      {({ values, handleChange, handleSubmit, setFieldValue }) => (
        <form onSubmit={handleSubmit}>
          <CardContent>
            <TextField
              name="role"
              label="Role"
              placeholder="Role (e.g. Developer)"
            />
            <TextField
              name="title"
              label="Title"
              placeholder="Title (e.g. Project name)"
            />
            {values.type === ProjectType.TechExperiences && (
              <OrganizationSection />
            )}
            <Select
              name="type"
              label="Type"
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
                <MenuItem key={type} value={type} />
              ))}
            </Select>
            <DatesSection
              selectEndDate={selectEndDate}
              setSelectEndDate={setSelectEndDate}
            />
            <TextField
              type="text"
              multiline
              name="description"
              label="Description"
              placeholder="Description"
              style={{ height: '20vh' }}
            />
            <TextField name="link" label="Link" placeholder="Link" />
            <CompetenciesSection />
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
            >
              {edit && 'Edit'}
              {create && 'Add'}
            </Button>
          </CardActions>
        </form>
      )}
    </Formik>
  );
}
