import { binIcon, plusIcon } from 'assets';
import { ErrorMessage, useFormikContext } from 'formik';
import { OrganizationDocument } from 'organization';
import { ReactElement } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Project, ProjectDocument } from '../utilsProject';

type DatesSectionProps = {
  selectEndDate: boolean;
  setSelectEndDate: (selectEndDate: boolean) => void;
};

export default function DatesSection<
  T extends
    | (ProjectDocument & { organization: OrganizationDocument })
    | Project,
>({ selectEndDate, setSelectEndDate }: DatesSectionProps): ReactElement {
  const { values, touched, errors, handleBlur, setFieldValue } =
    useFormikContext<T>();

  return (
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
          <Row>
            <Form.Group className="mb-3">
              <Form.Label>End date</Form.Label>
              <InputGroup>
                {!!selectEndDate && (
                  <Col xs={10}>
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
                    <ErrorMessage name="endDate">
                      {(errorMessage) => (
                        <Form.Control.Feedback type="invalid">
                          {errorMessage}
                        </Form.Control.Feedback>
                      )}
                    </ErrorMessage>
                  </Col>
                )}
                <Col>
                  <Button
                    onClick={() => {
                      setSelectEndDate(!selectEndDate);
                      setFieldValue('endDate', new Date());
                    }}
                    style={{ marginLeft: '8px' }}
                  >
                    {selectEndDate ? (
                      <img
                        alt="Bin icon"
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
                </Col>
              </InputGroup>
            </Form.Group>
          </Row>
        </Col>
      </Row>
    </Form.Group>
  );
}
