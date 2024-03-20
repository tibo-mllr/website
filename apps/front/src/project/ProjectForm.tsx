import { projectSchema, ProjectType } from '@website/shared-types';
import { binIcon, plusIcon } from 'assets';
import {
  Formik,
  type FormikValues,
  type FormikConfig,
  ErrorMessage,
  type FormikErrors,
} from 'formik';
import { type OrganizationDocument } from 'organization';
import { type ReactElement } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
} from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { type Option } from 'react-bootstrap-typeahead/types/types';
import { type ConnectedProps, connect } from 'react-redux';
import { type AppState } from 'reducers/types';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { type ProjectDocument, type Project } from './utilsProject';

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

const stateProps = (
  state: AppState,
): Pick<
  AppState['projectReducer'] & AppState['organizationReducer'],
  'competencies' | 'organizations'
> => ({
  competencies: state.projectReducer.competencies,
  organizations: state.organizationReducer.organizations,
});

const connector = connect(stateProps);

export function ProjectForm<
  T extends
    | (ProjectDocument & { organization: OrganizationDocument })
    | Project,
>({
  edit,
  organization,
  create,
  competencies,
  organizations,
  selectEndDate,
  setSelectEndDate,
  ...props
}: ProjectFormProps<T> & ConnectedProps<typeof connector>): ReactElement {
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
        setFieldTouched,
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
              <Card>
                <Card.Title>Organization</Card.Title>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Typeahead
                        id="organization.name"
                        isInvalid={
                          touched.organization &&
                          !!(
                            errors.organization as
                              | FormikErrors<T['organization']>
                              | undefined
                          )?.name
                        }
                        allowNew
                        onBlur={() =>
                          setFieldTouched('organization.name', true)
                        }
                        onInputChange={(text) =>
                          setFieldValue('organization.name', text)
                        }
                        onChange={(selected) => {
                          if (selected.length) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            delete (selected[0] as any).id;
                            setFieldValue('organization', selected[0]);
                          }
                          setFieldTouched('organization.name', true);
                        }}
                        selected={[values.organization.name as Option]}
                        labelKey={'name'}
                        options={organizations}
                        placeholder="Organization"
                      />
                      <ErrorMessage name="organization.name">
                        {(errorMessage) => (
                          <Form.Control.Feedback type="invalid">
                            {errorMessage}
                          </Form.Control.Feedback>
                        )}
                      </ErrorMessage>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="organization.location"
                        value={values.organization.location}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Location"
                        isInvalid={
                          touched.organization &&
                          !!(
                            errors.organization as
                              | FormikErrors<T['organization']>
                              | undefined
                          )?.location
                        }
                      />
                      <ErrorMessage name="organization.location">
                        {(errorMessage) => (
                          <Form.Control.Feedback type="invalid">
                            {errorMessage}
                          </Form.Control.Feedback>
                        )}
                      </ErrorMessage>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Website</Form.Label>
                      <Form.Control
                        type="text"
                        name="organization.website"
                        value={values.organization.website}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Website"
                        isInvalid={
                          touched.organization &&
                          !!(
                            errors.organization as
                              | FormikErrors<T['organization']>
                              | undefined
                          )?.website
                        }
                      />
                      <ErrorMessage name="organization.website">
                        {(errorMessage) => (
                          <Form.Control.Feedback type="invalid">
                            {errorMessage}
                          </Form.Control.Feedback>
                        )}
                      </ErrorMessage>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        name="organization.description"
                        value={values.organization.description}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Description"
                        isInvalid={
                          touched.organization &&
                          !!(
                            errors.organization as
                              | FormikErrors<T['organization']>
                              | undefined
                          )?.description
                        }
                      />
                      <ErrorMessage name="organization.description">
                        {(errorMessage) => (
                          <Form.Control.Feedback type="invalid">
                            {errorMessage}
                          </Form.Control.Feedback>
                        )}
                      </ErrorMessage>
                    </Form.Group>
                  </Col>
                </Row>
              </Card>
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
            <Form.Group className="mb-3">
              <Row>
                <Col>
                  <Form.Label>Start date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={values.startDate.toISOString().split('T')[0]}
                    onBlur={handleBlur}
                    onChange={(event) =>
                      setFieldValue('startDate', new Date(event.target.value))
                    }
                    placeholder="Start date"
                    isInvalid={touched.startDate && !!errors.startDate}
                  />
                  <ErrorMessage name="startDate">
                    {(errorMessage) => (
                      <Form.Control.Feedback type="invalid">
                        {errorMessage}
                      </Form.Control.Feedback>
                    )}
                  </ErrorMessage>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>End date</Form.Label>
                    <InputGroup>
                      {!!selectEndDate && (
                        <>
                          <Form.Control
                            type="date"
                            name="endDate"
                            value={values.endDate?.toISOString().split('T')[0]}
                            onBlur={handleBlur}
                            onChange={(event) =>
                              setFieldValue(
                                'endDate',
                                new Date(event.target.value),
                              )
                            }
                            placeholder="End date"
                            isInvalid={touched.endDate && !!errors.endDate}
                          />
                          <ErrorMessage name="endDate">
                            {(errorMessage) => (
                              <Form.Control.Feedback type="invalid">
                                {errorMessage}
                              </Form.Control.Feedback>
                            )}
                          </ErrorMessage>
                        </>
                      )}
                      <Button
                        onClick={() => {
                          setSelectEndDate(!selectEndDate);
                          setFieldValue('endDate', new Date());
                        }}
                        style={{ marginLeft: '8px' }}
                      >
                        {selectEndDate ? (
                          <img
                            alt="Plus icon"
                            src={binIcon}
                            height="16"
                            className="d-inline-block align-center"
                            style={{ paddingRight: '8px' }}
                          />
                        ) : (
                          <>
                            <img
                              alt="Plus icon"
                              src={plusIcon}
                              height="16"
                              className="d-inline-block align-center"
                              style={{ paddingRight: '8px' }}
                            />
                            Add end date
                          </>
                        )}
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            </Form.Group>
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
            <Card>
              <Card.Body>
                {values.competencies.length ? (
                  values.competencies.map((_, index) => (
                    <Row key={index}>
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Label>Competency</Form.Label>
                          <Form.Control
                            type="text"
                            name={`competencies[${index}]`}
                            list="competenciesList"
                            value={values.competencies[index]}
                            onChange={handleChange}
                            placeholder="Competency"
                            isInvalid={
                              touched.competencies &&
                              !!errors.competencies?.[index]
                            }
                          />
                          <datalist id="competenciesList">
                            {competencies.map((competency) => (
                              <option key={competency} value={competency} />
                            ))}
                          </datalist>
                          <ErrorMessage name={`competencies.${index}`}>
                            {(errorMessage) => (
                              <Form.Control.Feedback type="invalid">
                                {errorMessage}
                              </Form.Control.Feedback>
                            )}
                          </ErrorMessage>
                        </Form.Group>
                      </Col>
                      <Col md={2}>
                        <Form.Group className="mb-3">
                          <Form.Label>Delete</Form.Label>
                          <InputGroup>
                            <Button
                              onClick={() =>
                                setFieldValue(
                                  'competencies',
                                  values.competencies.filter(
                                    (_, i) => i !== index,
                                  ),
                                )
                              }
                            >
                              Delete
                            </Button>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>
                  ))
                ) : (
                  <Row>
                    <Col
                      style={{
                        textAlign: 'center',
                        color:
                          touched.competencies && !!errors.competencies
                            ? 'red'
                            : undefined,
                      }}
                    >
                      No competencies linked to this project
                    </Col>
                  </Row>
                )}
              </Card.Body>
              <Card.Footer>
                <Button
                  onClick={() =>
                    setFieldValue('competencies', [...values.competencies, ''])
                  }
                >
                  <img
                    alt="Plus icon"
                    src={plusIcon}
                    height="16"
                    className="d-inline-block align-center"
                    style={{ paddingRight: '8px' }}
                  />
                  Add competency
                </Button>
              </Card.Footer>
            </Card>
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

export default connector(ProjectForm);
