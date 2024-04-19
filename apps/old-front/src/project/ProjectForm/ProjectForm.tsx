import { projectSchema, ProjectType } from '@website/shared-types';
import { SelectFieldWithLabel, TextFieldWithLabel } from 'components';
import { Formik, type FormikValues, type FormikConfig } from 'formik';
import { type OrganizationDocument } from 'organization';
import { type ReactElement } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { type ProjectDocument, type Project } from '../utilsProject';
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
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <TextFieldWithLabel
              name="role"
              label="Role"
              placeholder="Role (e.g. Developer)"
              groupClassName="mb-3"
            />
            <TextFieldWithLabel
              name="title"
              label="Title"
              placeholder="Title (e.g. Project name)"
              groupClassName="mb-3"
            />
            {values.type === ProjectType.TechExperiences && (
              <OrganizationSection />
            )}
            <SelectFieldWithLabel
              name="type"
              label="Type"
              options={Object.values(ProjectType)}
              helperOption="Select a type"
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
              groupClassName="mb-3"
            />
            <DatesSection
              selectEndDate={selectEndDate}
              setSelectEndDate={setSelectEndDate}
            />
            <TextFieldWithLabel
              as="textarea"
              name="description"
              label="Description"
              placeholder="Description"
              groupClassName="mb-3"
              style={{ height: '20vh' }}
            />
            <TextFieldWithLabel
              name="link"
              label="Link"
              placeholder="Link"
              groupClassName="mb-3"
            />
            <CompetenciesSection />
          </Modal.Body>
          <Modal.Footer>
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
          </Modal.Footer>
        </Form>
      )}
    </Formik>
  );
}
