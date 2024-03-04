import { ProjectType } from '@website/shared-types';
import { binIcon, plusIcon } from 'assets';
import { OrganizationDocument } from 'organization';
import {
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
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
import { Option } from 'react-bootstrap-typeahead/types/types';
import { ConnectedProps, connect } from 'react-redux';
import { AppState } from 'reducers/types';
import { FormErrors, client } from 'utils';
import { ProjectDocument } from './utilsProject';

type EditProjectProps = {
  projectToEdit: ProjectDocument;
  setProjectToEdit: (project: ProjectDocument) => void;
  show: boolean;
  setShow: (show: boolean) => void;
};

const stateProps = (
  state: AppState,
): Pick<
  AppState['projectReducer'] &
    AppState['organizationReducer'] &
    AppState['adminReducer'],
  'competencies' | 'organizations' | 'token'
> => ({
  competencies: state.projectReducer.competencies,
  organizations: state.organizationReducer.organizations,
  token: state.adminReducer.token,
});

const connector = connect(stateProps);

export function EditProjectModal({
  projectToEdit,
  setProjectToEdit,
  show,
  setShow,
  competencies,
  organizations,
  token,
}: EditProjectProps & ConnectedProps<typeof connector>): ReactElement {
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectEndDate, setSelectEndDate] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const checkTimeStamp = (begin: Date, end: Date): boolean => {
    begin = new Date(begin);
    end = new Date(end);
    return begin.getTime() <= end.getTime();
  };

  const validateForm = useCallback(() => {
    const errors: FormErrors = {};
    if (!projectToEdit.role) errors.role = 'Role is required';
    if (!projectToEdit.title) errors.title = 'Title is required';
    if (!projectToEdit.organization.name)
      errors.organizationName = 'Organization name is required';
    if (!projectToEdit.organization.description)
      errors.organizationDescription = 'Organization description is required';
    if (!projectToEdit.organization.location)
      errors.organizationLocation = 'Organization location is required';
    if (!projectToEdit.organization.website)
      errors.organizationWebsite = 'Organization website is required';
    if (
      !projectToEdit.organization.website?.startsWith('http://') &&
      !projectToEdit.organization.website?.startsWith('https://')
    )
      errors.organizationWebsite =
        'Please enter the full URL (starting with "http://" or "https://")';
    if (!projectToEdit.type) errors.type = 'Type is required';
    if (!projectToEdit.startDate) errors.startDate = 'Start date is required';
    if (
      projectToEdit.startDate &&
      projectToEdit.endDate &&
      !checkTimeStamp(projectToEdit.startDate, projectToEdit.endDate)
    ) {
      errors.endDate = 'End date must be after start date';
      errors.startDate = 'Start date must be before end date';
    }
    if (!projectToEdit.description)
      errors.description = 'Description is required';
    if (
      projectToEdit.link &&
      !projectToEdit.link?.startsWith('http://') &&
      !projectToEdit.link?.startsWith('https://')
    )
      errors.link =
        'Please enter the full URL (starting with "http://" or "https://")';
    if (!projectToEdit.competencies.length)
      errors.competencies = 'Competencies are required';
    if (projectToEdit.competencies.length) {
      for (let i = 0; i < projectToEdit.competencies.length; i++) {
        if (!projectToEdit.competencies[i])
          errors['competency' + i] = 'Competency is required';
      }
    }

    return errors;
  }, [projectToEdit]);

  const handleEdit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateForm();

    if (Object.keys(errors).length) setErrors(errors);
    else if (!projectToEdit.organization._id) {
      const organizationToPost: Partial<OrganizationDocument> =
        projectToEdit.organization;
      delete organizationToPost._id;
      client
        .post<OrganizationDocument>('/organization', organizationToPost, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          client
            .put<ProjectDocument>(
              '/project/' + projectToEdit._id,
              {
                ...projectToEdit,
                organization: data._id,
                endDate: selectEndDate ? projectToEdit.endDate : undefined,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            )
            .then(() => {
              alert('Project edited');
              setShow(false);
            })
            .catch((error) => {
              alert(error);
              console.error(error);
            });
        })
        .catch((error) => {
          alert(error);
          console.error(error);
        });
      setSubmitted(false);
    } else {
      const organizationToCheck = organizations.find(
        (organization) => organization._id === projectToEdit.organization._id,
      );
      if (
        organizationToCheck?.name !== projectToEdit.organization.name ||
        organizationToCheck?.description !==
          projectToEdit.organization.description ||
        organizationToCheck?.location !== projectToEdit.organization.location ||
        organizationToCheck?.website !== projectToEdit.organization.website
      ) {
        client
          .put<OrganizationDocument>(
            '/organization/' + projectToEdit.organization._id,
            projectToEdit.organization,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(({ data }) => {
            client
              .put<ProjectDocument>(
                '/project/' + projectToEdit._id,
                {
                  ...projectToEdit,
                  organization: data._id,
                  endDate: selectEndDate ? projectToEdit.endDate : undefined,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              )
              .then(() => {
                alert('Project edited');
                setShow(false);
              })
              .catch((error) => {
                alert(error);
                console.error(error);
              });
          })
          .catch((error) => {
            alert(error);
            console.error(error);
          });
        setSubmitted(false);
      } else {
        client
          .put<ProjectDocument>(
            '/project/' + projectToEdit._id,
            {
              ...projectToEdit,
              organization: projectToEdit.organization._id,
              endDate: selectEndDate ? projectToEdit.endDate : undefined,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(() => {
            alert('Project edited');
            setShow(false);
          })
          .catch((error) => {
            alert(error);
            console.error(error);
          });
        setSubmitted(false);
      }
    }
  };

  useEffect(() => {
    setErrors(validateForm());
  }, [validateForm]);

  return (
    <Modal
      show={show}
      onHide={(): void => {
        setShow(false);
        setSubmitted(false);
      }}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit project</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleEdit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control
              type="text"
              value={projectToEdit.role}
              onChange={(event): void =>
                setProjectToEdit({
                  ...projectToEdit,
                  role: event.target.value,
                })
              }
              placeholder="Role"
              isValid={!errors.role && !!projectToEdit.role}
              isInvalid={!!errors.role && (!!projectToEdit.role || submitted)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.role}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={projectToEdit.title}
              onChange={(event): void =>
                setProjectToEdit({
                  ...projectToEdit,
                  title: event.target.value,
                })
              }
              placeholder="Title"
              isValid={!errors.title && !!projectToEdit.title}
              isInvalid={!!errors.title && (!!projectToEdit.title || submitted)}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Card>
            <Card.Title>Organization</Card.Title>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Typeahead
                    id="organizationName"
                    isValid={
                      !errors.organizationName &&
                      !!projectToEdit.organization.name
                    }
                    isInvalid={
                      !!errors.organizationName &&
                      (!!projectToEdit.organization.name || submitted)
                    }
                    allowNew
                    onInputChange={(text): void =>
                      setProjectToEdit({
                        ...projectToEdit,
                        organization: {
                          ...projectToEdit.organization,
                          name: text,
                        },
                      })
                    }
                    onChange={(selected): void => {
                      if (selected.length)
                        setProjectToEdit({
                          ...projectToEdit,
                          organization: selected[0] as OrganizationDocument,
                        });
                    }}
                    selected={[projectToEdit.organization.name as Option]}
                    labelKey={'name'}
                    options={organizations}
                    placeholder="Organization"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={projectToEdit.organization.location}
                    onChange={(event): void =>
                      setProjectToEdit({
                        ...projectToEdit,
                        organization: {
                          ...projectToEdit.organization,
                          location: event.target.value,
                        },
                      })
                    }
                    placeholder="Location"
                    isValid={
                      !errors.organizationLocation &&
                      !!projectToEdit.organization.location
                    }
                    isInvalid={
                      !!errors.organizationLocation &&
                      (!!projectToEdit.organization.location || submitted)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.organizationLocation}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="text"
                    value={projectToEdit.organization.website}
                    onChange={(event): void =>
                      setProjectToEdit({
                        ...projectToEdit,
                        organization: {
                          ...projectToEdit.organization,
                          website: event.target.value,
                        },
                      })
                    }
                    placeholder="Website"
                    isValid={
                      !errors.organizationWebsite &&
                      projectToEdit.organization.website?.length > 6
                    }
                    isInvalid={
                      !!errors.organizationWebsite &&
                      (projectToEdit.organization.website?.length > 6 ||
                        submitted)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.organizationWebsite}
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
                    value={projectToEdit.organization.description}
                    onChange={(event): void =>
                      setProjectToEdit({
                        ...projectToEdit,
                        organization: {
                          ...projectToEdit.organization,
                          description: event.target.value,
                        },
                      })
                    }
                    placeholder="Description"
                    isValid={
                      !errors.organizationDescription &&
                      !!projectToEdit.organization.description
                    }
                    isInvalid={
                      !!errors.organizationDescription &&
                      (!!projectToEdit.organization.description || submitted)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.organizationDescription}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              value={projectToEdit.type}
              onChange={(event): void =>
                setProjectToEdit({
                  ...projectToEdit,
                  type: event.target.value as ProjectType,
                })
              }
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
                  value={
                    projectToEdit.startDate
                      ? new Date(projectToEdit.startDate)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                  onChange={(event): void =>
                    setProjectToEdit({
                      ...projectToEdit,
                      startDate: new Date(event.target.value),
                    })
                  }
                  placeholder="Start date"
                  isValid={!errors.startDate && !!projectToEdit.startDate}
                  isInvalid={
                    !!errors.startDate &&
                    (!!projectToEdit.startDate || submitted)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.startDate}
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>End date</Form.Label>
                  <InputGroup>
                    {!!selectEndDate && (
                      <Form.Control
                        type="date"
                        value={
                          projectToEdit.endDate
                            ? new Date(projectToEdit.endDate)
                                .toISOString()
                                .split('T')[0]
                            : ''
                        }
                        onChange={(event): void =>
                          setProjectToEdit({
                            ...projectToEdit,
                            endDate: new Date(event.target.value),
                          })
                        }
                        placeholder="End date"
                      />
                    )}
                    <Button
                      onClick={(): void => {
                        setSelectEndDate(!selectEndDate);
                        setProjectToEdit({
                          ...projectToEdit,
                          endDate: new Date(),
                        });
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
              value={projectToEdit.description}
              onChange={(event): void =>
                setProjectToEdit({
                  ...projectToEdit,
                  description: event.target.value,
                })
              }
              placeholder="Description"
              isValid={!errors.description && !!projectToEdit.description}
              isInvalid={
                !!errors.description &&
                (!!projectToEdit.description || submitted)
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="text"
              value={projectToEdit.link}
              onChange={(event): void =>
                setProjectToEdit({
                  ...projectToEdit,
                  link: event.target.value,
                })
              }
              placeholder="Link"
              isValid={
                !errors.link &&
                !!(!projectToEdit.link || projectToEdit.link.length > 6)
              }
              isInvalid={
                !!errors.link &&
                (!!(!projectToEdit.link || projectToEdit.link.length > 6) ||
                  submitted)
              }
            />
            <Form.Control.Feedback type="invalid">
              {errors.link}
            </Form.Control.Feedback>
          </Form.Group>
          <Card>
            <Card.Body>
              {projectToEdit.competencies.length ? (
                projectToEdit.competencies.map((_, index) => (
                  <Row key={index}>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Competency</Form.Label>
                        <Form.Control
                          type="text"
                          list="competenciesList"
                          value={projectToEdit.competencies[index]}
                          onChange={(event): void =>
                            setProjectToEdit({
                              ...projectToEdit,
                              competencies: [
                                ...projectToEdit.competencies.slice(0, index),
                                event.target.value,
                                ...projectToEdit.competencies.slice(index + 1),
                              ],
                            })
                          }
                          placeholder="Competency"
                          isValid={
                            !errors['competency' + index] &&
                            !!projectToEdit.competencies[index]
                          }
                          isInvalid={
                            !!errors['competency' + index] &&
                            (!!projectToEdit.competencies[index] || submitted)
                          }
                        />
                        <datalist id="competenciesList">
                          {competencies.map((competency) => (
                            <option key={competency} value={competency} />
                          ))}
                        </datalist>
                        <Form.Control.Feedback type="invalid">
                          {errors['competency' + index]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Delete</Form.Label>
                        <InputGroup>
                          <Button
                            onClick={(): void =>
                              setProjectToEdit({
                                ...projectToEdit,
                                competencies: [
                                  ...projectToEdit.competencies.slice(0, index),
                                  ...projectToEdit.competencies.slice(
                                    index + 1,
                                  ),
                                ],
                              })
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
                        !!errors.competencies &&
                        (!!projectToEdit.competencies[0] || submitted)
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
                onClick={(): void =>
                  setProjectToEdit({
                    ...projectToEdit,
                    competencies: [...projectToEdit.competencies, ''],
                  })
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
          <Button type="submit">Edit</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default connector(EditProjectModal);
