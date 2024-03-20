import { projectSchema, ProjectType } from '@website/shared-types';
import {
  Formik,
  type FormikValues,
  type FormikConfig,
  ErrorMessage,
} from 'formik';
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
      {({
        values,
        touched,
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => (
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={values.role}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Role (e.g. Developer)"
                isInvalid={touched.role && !!errors.role}
              />
              <ErrorMessage name="role">
                {(errorMessage) => (
                  <Form.Control.Feedback type="invalid">
                    {errorMessage}
                  </Form.Control.Feedback>
                )}
              </ErrorMessage>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={values.title}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Title (e.g. Project name)"
                isInvalid={touched.title && !!errors.title}
              />
              <ErrorMessage name="title">
                {(errorMessage) => (
                  <Form.Control.Feedback type="invalid">
                    {errorMessage}
                  </Form.Control.Feedback>
                )}
              </ErrorMessage>
            </Form.Group>
            {values.type === ProjectType.TechExperiences && (
              <OrganizationSection />
            )}
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={values.type}
                onBlur={handleBlur}
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
                <option disabled>Select a type</option>
                {Object.values(ProjectType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <DatesSection
              selectEndDate={selectEndDate}
              setSelectEndDate={setSelectEndDate}
            />
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Description"
                isInvalid={touched.description && !!errors.description}
              />
              <ErrorMessage name="description">
                {(errorMessage) => (
                  <Form.Control.Feedback type="invalid">
                    {errorMessage}
                  </Form.Control.Feedback>
                )}
              </ErrorMessage>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="text"
                name="link"
                value={values.link}
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Link"
                isInvalid={touched.link && !!errors.link}
              />
              <ErrorMessage name="link">
                {(errorMessage) => (
                  <Form.Control.Feedback type="invalid">
                    {errorMessage}
                  </Form.Control.Feedback>
                )}
              </ErrorMessage>
            </Form.Group>
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
