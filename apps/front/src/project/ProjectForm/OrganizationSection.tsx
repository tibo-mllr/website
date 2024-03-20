import { ErrorMessage, useFormikContext, type FormikErrors } from 'formik';
import { type OrganizationDocument } from 'organization';
import { type ReactElement } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { type Option } from 'react-bootstrap-typeahead/types/types';
import { connect, ConnectedProps } from 'react-redux';
import { AppState } from 'reducers/types';
import { type Project, type ProjectDocument } from '../utilsProject';

const stateProps = (
  state: AppState,
): Pick<AppState['organizationReducer'], 'organizations'> => ({
  organizations: state.organizationReducer.organizations,
});

const connector = connect(stateProps);

function OrganizationSection<
  T extends
    | (ProjectDocument & { organization: OrganizationDocument })
    | Project,
>({ organizations }: ConnectedProps<typeof connector>): ReactElement {
  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    setFieldTouched,
    setFieldValue,
  } = useFormikContext<T>();

  return (
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
              onBlur={() => setFieldTouched('organization.name', true)}
              onInputChange={(text) => setFieldValue('organization.name', text)}
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
  );
}

export default connector(OrganizationSection);
