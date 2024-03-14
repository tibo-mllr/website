import { ProjectType } from '@website/shared-types';
import { binIcon, plusIcon } from 'assets';
import { type FormikProps } from 'formik';
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
import { type Project, type ProjectDocument } from './utilsProject';

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
type ProjectFormProps = Pick<
  FormikProps<
    (ProjectDocument & { organization: OrganizationDocument }) | Project
  >,
  | 'values'
  | 'touched'
  | 'errors'
  | 'handleBlur'
  | 'handleChange'
  | 'handleSubmit'
  | 'setFieldTouched'
  | 'setFieldValue'
> &
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

export function ProjectForm({
  values,
  touched,
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  setFieldTouched,
  setFieldValue,
  edit,
  organization,
  create,
  competencies,
  organizations,
  selectEndDate,
  setSelectEndDate,
}: ProjectFormProps & ConnectedProps<typeof connector>): ReactElement {
  return (
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
          <Form.Control.Feedback type="invalid">
            {errors.role}
          </Form.Control.Feedback>
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
          <Form.Control.Feedback type="invalid">
            {errors.title}
          </Form.Control.Feedback>
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
                      touched.organization?.name && !!errors.organization?.name
                    }
                    allowNew
                    onBlur={() => setFieldTouched('organization.name', true)}
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
                  <Form.Control.Feedback type="invalid">
                    {errors.organization?.name}
                  </Form.Control.Feedback>
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
                      touched.organization && !!errors.organization?.location
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.organization?.location}
                  </Form.Control.Feedback>
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
                      touched.organization && !!errors.organization?.website
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.organization?.website}
                  </Form.Control.Feedback>
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
                      touched.organization && !!errors.organization?.description
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.organization?.description}
                  </Form.Control.Feedback>
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
                          setFieldValue('endDate', new Date(event.target.value))
                        }
                        placeholder="End date"
                        isInvalid={touched.endDate && !!errors.endDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.endDate}
                      </Form.Control.Feedback>
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
          <Form.Control.Feedback type="invalid">
            {errors.description}
          </Form.Control.Feedback>
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
          <Form.Control.Feedback type="invalid">
            {errors.link}
          </Form.Control.Feedback>
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
                          touched.competencies && !!errors.competencies?.[index]
                        }
                      />
                      <datalist id="competenciesList">
                        {competencies.map((competency) => (
                          <option key={competency} value={competency} />
                        ))}
                      </datalist>
                      <Form.Control.Feedback type="invalid">
                        {errors.competencies?.[index]}
                      </Form.Control.Feedback>
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
                              values.competencies.filter((_, i) => i !== index),
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
  );
}

export default connector(ProjectForm);
