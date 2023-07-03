import {
  FormEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { FormErrors, client } from '../utils';
import { Project, ProjectDocument, ProjectType } from './utilsProject';
import { OrganizationDocument } from '../organization/utilsOrganization';
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
} from 'react-bootstrap';
import plusIcon from '../assets/plusIcon.png';
import editIcon from '../assets/editIcon.png';
import binIcon from '../assets/binIcon.png';
import { Option } from 'react-bootstrap-typeahead/types/types';

type ProjectViewProps = {
  showNew: boolean;
  setShowNew: (show: boolean) => void;
};
export default function ProjectView({
  showNew,
  setShowNew,
}: ProjectViewProps): ReactElement {
  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationDocument[]>(
    [],
  );
  const [showOrganization, setShowOrganization] = useState<boolean>(false);
  const [organization, setOrganization] = useState<OrganizationDocument>({
    _id: '',
    name: '',
    description: '',
    location: '',
    website: '',
  });
  const [newProject, setNewProject] = useState<Project>({
    role: '',
    title: '',
    description: '',
    competencies: [],
    link: '',
    type: ProjectType.Education,
    organization: {
      _id: '',
      name: '',
      description: '',
      location: '',
      website: '',
    },
    startDate: new Date(),
    endDate: new Date(),
  });
  const [newErrors, setNewErrors] = useState<FormErrors>({});
  const [projectToEdit, setProjectToEdit] = useState<ProjectDocument>({
    _id: '',
    role: '',
    title: '',
    description: '',
    competencies: [],
    link: '',
    type: ProjectType.Education,
    organization: {
      _id: '',
      name: '',
      description: '',
      location: '',
      website: '',
    },
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [editErrors, setEditErrors] = useState<FormErrors>({});
  const [selectEndDate, setSelectEndDate] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const checkTimeStamp = (begin: Date, end: Date): boolean => {
    begin = new Date(begin);
    end = new Date(end);
    return begin.getTime() < end.getTime();
  };

  const validateNewForm = useCallback(() => {
    const errors: FormErrors = {};
    if (!newProject.role) errors.role = 'Role is required';
    if (!newProject.title) errors.title = 'Title is required';
    if (!newProject.organization.name)
      errors.organizationName = 'Organization name is required';
    if (!newProject.organization.description)
      errors.organizationDescription = 'Organization description is required';
    if (!newProject.organization.location)
      errors.organizationLocation = 'Organization location is required';
    if (!newProject.organization.website)
      errors.organizationWebsite = 'Organization website is required';
    if (
      !newProject.organization.website.startsWith('http://') &&
      !newProject.organization.website.startsWith('https://')
    )
      errors.organizationWebsite =
        'Please enter the full URL (starting with "http://" or "https://")';
    if (!newProject.type) errors.type = 'Type is required';
    if (!newProject.startDate) errors.startDate = 'Start date is required';
    if (
      newProject.startDate &&
      newProject.endDate &&
      !checkTimeStamp(newProject.startDate, newProject.endDate)
    ) {
      errors.endDate = 'End date must be after start date';
      errors.startDate = 'Start date must be before end date';
    }
    if (!newProject.description) errors.description = 'Description is required';
    if (
      newProject.link &&
      !newProject.link?.startsWith('http://') &&
      !newProject.link?.startsWith('https://')
    )
      errors.link =
        'Please enter the full URL (starting with "http://" or "https://")';
    if (!newProject.competencies.length)
      errors.competencies = 'Competencies are required';
    if (newProject.competencies.length) {
      for (let i = 0; i < newProject.competencies.length; i++) {
        if (!newProject.competencies[i])
          errors['competency' + i] = 'Competency is required';
      }
    }

    return errors;
  }, [newProject]);

  const handleCreate = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);
    const errors = validateNewForm();

    if (Object.keys(errors).length) setNewErrors(errors);
    else if (!newProject.organization._id) {
      client
        .post('/organization', newProject.organization, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
          },
        })
        .then((response) => {
          setOrganizations([
            ...organizations,
            response.data as OrganizationDocument,
          ]);
          client
            .post(
              '/project',
              {
                ...newProject,
                organization: response.data._id,
              },
              {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem(
                    'loginToken',
                  )}`,
                },
              },
            )
            .then((response) => {
              alert('Project added');
              setProjects([...projects, response.data as ProjectDocument]);
              setShowNew(false);
            })
            .catch((error) => {
              alert(error);
              console.log(error);
            });
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
      setSubmitted(false);
    } else {
      const organizationToCheck = organizations.find(
        (organization) => organization._id === newProject.organization._id,
      );
      if (
        organizationToCheck?.name !== newProject.organization.name ||
        organizationToCheck?.description !==
          newProject.organization.description ||
        organizationToCheck?.location !== newProject.organization.location ||
        organizationToCheck?.website !== newProject.organization.website
      ) {
        client
          .put(
            '/organization/' + newProject.organization._id,
            newProject.organization,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
              },
            },
          )
          .then((response) => {
            setOrganizations([
              ...organizations.filter(
                (organization) => organization._id !== response.data._id,
              ),
              response.data as OrganizationDocument,
            ]);
            client
              .post(
                '/project',
                {
                  ...newProject,
                  organization: response.data._id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem(
                      'loginToken',
                    )}`,
                  },
                },
              )
              .then((response) => {
                alert('Project added');
                setProjects([...projects, response.data as ProjectDocument]);
                setShowNew(false);
              })
              .catch((error) => {
                alert(error);
                console.log(error);
              });
          })
          .catch((error) => {
            alert(error);
            console.log(error);
          });
        setSubmitted(false);
      } else {
        client
          .post(
            '/project',
            {
              ...newProject,
              organization: newProject.organization._id,
            },
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
              },
            },
          )
          .then((response) => {
            alert('Project added');
            setProjects([...projects, response.data as ProjectDocument]);
            setShowNew(false);
          })
          .catch((error) => {
            alert(error);
            console.log(error);
          });
        setSubmitted(false);
      }
    }
  };

  const validateEditForm = useCallback(() => {
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
      !projectToEdit.organization.website.startsWith('http://') &&
      !projectToEdit.organization.website.startsWith('https://')
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
    const errors = validateEditForm();

    if (Object.keys(errors).length) setEditErrors(errors);
    else if (!projectToEdit.organization._id) {
      client
        .post('/organization', projectToEdit.organization, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
          },
        })
        .then((response) => {
          setOrganizations([
            ...organizations,
            response.data as OrganizationDocument,
          ]);
          client
            .put(
              '/project/' + projectToEdit._id,
              {
                ...projectToEdit,
                organization: response.data._id,
              },
              {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem(
                    'loginToken',
                  )}`,
                },
              },
            )
            .then((response) => {
              alert('Project edited');
              setProjects([...projects, response.data as ProjectDocument]);
              setShowEdit(false);
            })
            .catch((error) => {
              alert(error);
              console.log(error);
            });
        })
        .catch((error) => {
          alert(error);
          console.log(error);
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
          .put(
            '/organization/' + projectToEdit.organization._id,
            projectToEdit.organization,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
              },
            },
          )
          .then((response) => {
            setOrganizations([
              ...organizations.filter(
                (organization) => organization._id !== response.data._id,
              ),
              response.data as OrganizationDocument,
            ]);
            client
              .put(
                '/project/' + projectToEdit._id,
                {
                  ...projectToEdit,
                  organization: response.data._id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem(
                      'loginToken',
                    )}`,
                  },
                },
              )
              .then((response) => {
                alert('Project edited');
                setProjects([...projects, response.data as ProjectDocument]);
                setShowEdit(false);
              })
              .catch((error) => {
                alert(error);
                console.log(error);
              });
          })
          .catch((error) => {
            alert(error);
            console.log(error);
          });
        setSubmitted(false);
      } else {
        client
          .put(
            '/project/' + projectToEdit._id,
            {
              ...projectToEdit,
              organization: projectToEdit.organization._id,
            },
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
              },
            },
          )
          .then((response) => {
            alert('Project edited');
            setProjects([...projects, response.data as ProjectDocument]);
            setShowEdit(false);
          })
          .catch((error) => {
            alert(error);
            console.log(error);
          });
        setSubmitted(false);
      }
    }
  };

  const handleDelete = (id: string): void => {
    client
      .delete('/project/' + id, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('loginToken')}`,
        },
      })
      .then(() => setProjects(projects.filter((project) => project._id !== id)))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    client
      .get('/project')
      .then((response) => setProjects(response.data as ProjectDocument[]))
      .catch((error) => console.log(error));
    client
      .get('/organization')
      .then((response) =>
        setOrganizations(response.data as OrganizationDocument[]),
      )
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Row>
        <h1 style={{ textAlign: 'center' }}>
          These are the projects I worked on
        </h1>
      </Row>
      {projects.length ? (
        projects.map((project) => (
          <Row key={project._id} style={{ marginBottom: '8px' }}>
            <Col>
              <Card>
                <Card.Header>
                  <Card.Title>
                    <span style={{ fontSize: '1.5em' }}>
                      {project.role}
                      {' | '}
                    </span>
                    <span
                      style={{ fontSize: '1em' }}
                      onClick={(): void => {
                        setShowOrganization(true);
                        setOrganization(project.organization);
                      }}
                    >
                      <u>{project.organization.name}</u>
                      {' | '}
                    </span>
                    <span style={{ fontSize: '0.75em' }}>
                      {new Date(project.startDate).toLocaleDateString()} -{' '}
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : 'Present'}
                    </span>
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <Card.Text>
                    <b>{project.title}</b>
                    <br />
                    {project.description}
                    <br />
                    <i>{project.competencies.join(' • ')}</i>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  {project.link && (
                    <Col>
                      <a href={project.link}>See more</a>
                    </Col>
                  )}
                  {!!sessionStorage.getItem('loginToken') &&
                    sessionStorage.getItem('role') === 'superAdmin' && (
                      <Col className="d-flex justify-content-end">
                        <Button
                          onClick={(): void => {
                            setShowEdit(true);
                            setProjectToEdit(project);
                          }}
                          style={{
                            marginRight: '8px',
                          }}
                        >
                          <img
                            alt="Edit"
                            src={editIcon}
                            height="24"
                            className="d-inline-block align-center"
                          />
                        </Button>
                        <Button onClick={(): void => handleDelete(project._id)}>
                          <img
                            alt="Delete"
                            src={binIcon}
                            height="24"
                            className="d-inline-block align-center"
                          />
                        </Button>
                      </Col>
                    )}
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        ))
      ) : (
        <i>No project to display</i>
      )}
      <Modal
        show={showOrganization}
        onHide={(): void => setShowOrganization(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{organization.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <b>Location: </b>
            {organization.location}
          </p>
          <p>
            <b>Website: </b>
            <a href={organization.website}>{organization.website}</a>
          </p>
        </Modal.Body>
      </Modal>
      {!!sessionStorage.getItem('loginToken') &&
        (sessionStorage.getItem('role') === 'admin' ||
          sessionStorage.getItem('role') === 'superAdmin') && (
          <Modal
            show={showNew}
            onHide={(): void => {
              setShowNew(false);
              setSubmitted(false);
            }}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>New project</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleCreate}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProject.role}
                    onChange={(event): void =>
                      setNewProject({
                        ...newProject,
                        role: event.target.value,
                      })
                    }
                    placeholder="Role"
                    isValid={!newErrors.role && !!newProject.role}
                    isInvalid={
                      !!newErrors.role && (!!newProject.role || submitted)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {newErrors.role}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProject.title}
                    onChange={(event): void =>
                      setNewProject({
                        ...newProject,
                        title: event.target.value,
                      })
                    }
                    placeholder="Title"
                    isValid={!newErrors.title && !!newProject.title}
                    isInvalid={
                      !!newErrors.title && (!!newProject.title || submitted)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {newErrors.title}
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
                            !newErrors.organizationName &&
                            !!newProject.organization.name
                          }
                          isInvalid={
                            !!newErrors.organizationName &&
                            (!!newProject.organization.name || submitted)
                          }
                          allowNew
                          onInputChange={(text): void =>
                            setNewProject({
                              ...newProject,
                              organization: {
                                ...newProject.organization,
                                name: text,
                              },
                            })
                          }
                          onChange={(selected): void => {
                            if (selected.length)
                              setNewProject({
                                ...newProject,
                                organization:
                                  selected[0] as OrganizationDocument,
                              });
                          }}
                          selected={[newProject.organization.name as Option]}
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
                          value={newProject.organization.location}
                          onChange={(event): void =>
                            setNewProject({
                              ...newProject,
                              organization: {
                                ...newProject.organization,
                                location: event.target.value,
                              },
                            })
                          }
                          placeholder="Location"
                          isValid={
                            !newErrors.organizationLocation &&
                            !!newProject.organization.location
                          }
                          isInvalid={
                            !!newErrors.organizationLocation &&
                            (!!newProject.organization.location || submitted)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {newErrors.organizationLocation}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Website</Form.Label>
                        <Form.Control
                          type="text"
                          value={newProject.organization.website}
                          onChange={(event): void =>
                            setNewProject({
                              ...newProject,
                              organization: {
                                ...newProject.organization,
                                website: event.target.value,
                              },
                            })
                          }
                          placeholder="Website"
                          isValid={
                            !newErrors.organizationWebsite &&
                            newProject.organization.website?.length > 6
                          }
                          isInvalid={
                            !!newErrors.organizationWebsite &&
                            (newProject.organization.website?.length > 6 ||
                              submitted)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {newErrors.organizationWebsite}
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
                          value={newProject.organization.description}
                          onChange={(event): void =>
                            setNewProject({
                              ...newProject,
                              organization: {
                                ...newProject.organization,
                                description: event.target.value,
                              },
                            })
                          }
                          placeholder="Description"
                          isValid={
                            !newErrors.organizationDescription &&
                            !!newProject.organization.description
                          }
                          isInvalid={
                            !!newErrors.organizationDescription &&
                            (!!newProject.organization.description || submitted)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {newErrors.organizationDescription}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={newProject.type}
                    onChange={(event): void =>
                      setNewProject({
                        ...newProject,
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
                          new Date(newProject.startDate)
                            .toISOString()
                            .split('T')[0]
                        }
                        onChange={(event): void =>
                          setNewProject({
                            ...newProject,
                            startDate: new Date(event.target.value),
                          })
                        }
                        placeholder="Start date"
                        isValid={!newErrors.startDate && !!newProject.startDate}
                        isInvalid={
                          !!newErrors.startDate &&
                          (!!newProject.startDate || submitted)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {newErrors.startDate}
                      </Form.Control.Feedback>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>End date</Form.Label>
                        <InputGroup>
                          {!!selectEndDate && (
                            <>
                              <Form.Control
                                type="date"
                                value={
                                  newProject.endDate
                                    ? new Date(newProject.endDate)
                                        .toISOString()
                                        .split('T')[0]
                                    : ''
                                }
                                onChange={(event): void =>
                                  setNewProject({
                                    ...newProject,
                                    endDate: new Date(event.target.value),
                                  })
                                }
                                placeholder="End date"
                                isValid={!newErrors.endDate}
                                isInvalid={!!newErrors.startDate && submitted}
                              />
                              <Form.Control.Feedback type="invalid">
                                {newErrors.endDate}
                              </Form.Control.Feedback>
                            </>
                          )}
                          <Button
                            onClick={(): void => {
                              setSelectEndDate(!selectEndDate);
                              setNewProject({
                                ...newProject,
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
                    value={newProject.description}
                    onChange={(event): void =>
                      setNewProject({
                        ...newProject,
                        description: event.target.value,
                      })
                    }
                    placeholder="Description"
                    isValid={!newErrors.description && !!newProject.description}
                    isInvalid={
                      !!newErrors.description &&
                      (!!newProject.description || submitted)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {newErrors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Link</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProject.link}
                    onChange={(event): void =>
                      setNewProject({
                        ...newProject,
                        link: event.target.value,
                      })
                    }
                    placeholder="Link"
                    isValid={
                      !newErrors.link &&
                      !!(!newProject.link || newProject.link.length > 6)
                    }
                    isInvalid={
                      !!newErrors.link &&
                      (!!(!newProject.link || newProject.link.length > 6) ||
                        submitted)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {newErrors.link}
                  </Form.Control.Feedback>
                </Form.Group>
                <Card>
                  <Card.Body>
                    {newProject.competencies.length ? (
                      newProject.competencies.map((_, index) => (
                        <Row key={index}>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>Competency</Form.Label>
                              <Form.Control
                                type="text"
                                value={newProject.competencies[index]}
                                onChange={(event): void =>
                                  setNewProject({
                                    ...newProject,
                                    competencies: [
                                      ...newProject.competencies.slice(
                                        0,
                                        index,
                                      ),
                                      event.target.value,
                                      ...newProject.competencies.slice(
                                        index + 1,
                                      ),
                                    ],
                                  })
                                }
                                placeholder="Competency"
                                isValid={
                                  !newErrors['competency' + index] &&
                                  !!newProject.competencies[index]
                                }
                                isInvalid={
                                  !!newErrors['competency' + index] &&
                                  (!!newProject.competencies[index] ||
                                    submitted)
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {newErrors['competency' + index]}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={2}>
                            <Form.Group className="mb-3">
                              <Form.Label>Delete</Form.Label>
                              <InputGroup>
                                <Button
                                  onClick={(): void =>
                                    setNewProject({
                                      ...newProject,
                                      competencies: [
                                        ...newProject.competencies.slice(
                                          0,
                                          index,
                                        ),
                                        ...newProject.competencies.slice(
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
                              !!newErrors.competencies &&
                              (!!newProject.competencies[0] || submitted)
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
                        setNewProject({
                          ...newProject,
                          competencies: [...newProject.competencies, ''],
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
                <Button type="submit">Create</Button>
              </Modal.Footer>
            </Form>
          </Modal>
        )}
      {!!sessionStorage.getItem('loginToken') &&
        sessionStorage.getItem('role') === 'superAdmin' && (
          <Modal
            show={showEdit}
            onHide={(): void => {
              setShowEdit(false);
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
                    isValid={!editErrors.role && !!projectToEdit.role}
                    isInvalid={
                      !!editErrors.role && (!!projectToEdit.role || submitted)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.role}
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
                    isValid={!editErrors.title && !!projectToEdit.title}
                    isInvalid={
                      !!editErrors.title && (!!projectToEdit.title || submitted)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.title}
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
                            !editErrors.organizationName &&
                            !!projectToEdit.organization.name
                          }
                          isInvalid={
                            !!editErrors.organizationName &&
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
                                organization:
                                  selected[0] as OrganizationDocument,
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
                            !editErrors.organizationLocation &&
                            !!projectToEdit.organization.location
                          }
                          isInvalid={
                            !!editErrors.organizationLocation &&
                            (!!projectToEdit.organization.location || submitted)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {editErrors.organizationLocation}
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
                            !editErrors.organizationWebsite &&
                            projectToEdit.organization.website?.length > 6
                          }
                          isInvalid={
                            !!editErrors.organizationWebsite &&
                            (projectToEdit.organization.website?.length > 6 ||
                              submitted)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {editErrors.organizationWebsite}
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
                            !editErrors.organizationDescription &&
                            !!projectToEdit.organization.description
                          }
                          isInvalid={
                            !!editErrors.organizationDescription &&
                            (!!projectToEdit.organization.description ||
                              submitted)
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {editErrors.organizationDescription}
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
                        isValid={
                          !editErrors.startDate && !!projectToEdit.startDate
                        }
                        isInvalid={
                          !!editErrors.startDate &&
                          (!!projectToEdit.startDate || submitted)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {editErrors.startDate}
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
                    isValid={
                      !editErrors.description && !!projectToEdit.description
                    }
                    isInvalid={
                      !!editErrors.description &&
                      (!!projectToEdit.description || submitted)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.description}
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
                      !editErrors.link &&
                      !!(!projectToEdit.link || projectToEdit.link.length > 6)
                    }
                    isInvalid={
                      !!editErrors.link &&
                      (!!(
                        !projectToEdit.link || projectToEdit.link.length > 6
                      ) ||
                        submitted)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.link}
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
                                value={projectToEdit.competencies[index]}
                                onChange={(event): void =>
                                  setProjectToEdit({
                                    ...projectToEdit,
                                    competencies: [
                                      ...projectToEdit.competencies.slice(
                                        0,
                                        index,
                                      ),
                                      event.target.value,
                                      ...projectToEdit.competencies.slice(
                                        index + 1,
                                      ),
                                    ],
                                  })
                                }
                                placeholder="Competency"
                                isValid={
                                  !editErrors['competency' + index] &&
                                  !!projectToEdit.competencies[index]
                                }
                                isInvalid={
                                  !!editErrors['competency' + index] &&
                                  (!!projectToEdit.competencies[index] ||
                                    submitted)
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {editErrors['competency' + index]}
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
                                        ...projectToEdit.competencies.slice(
                                          0,
                                          index,
                                        ),
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
                              !!editErrors.competencies &&
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
        )}
    </>
  );
}
