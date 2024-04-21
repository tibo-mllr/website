import { type ReactElement } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from 'react-bootstrap';
import { CompetenciesSection, ProjectsSection } from './ui';

export default function ResumeView(): ReactElement {
  return (
    <Row>
      <Col md={3} xs={12} className="my-3">
        <Card>
          <CardHeader>
            <CardTitle>MULLER Thibault</CardTitle>
          </CardHeader>
          <CardBody>
            <b className="fs-4">About me</b>
            <br />
            <span>
              Interested in DIY & sciences since young, my passions took me to
              where I am now: in my fourth year of Master of Engineering at
              CentraleSupélec, wanting to become engineer in order to meet the
              needs of tomorrow, with the greatest respect for our environment.
            </span>
            <br />
            <br />
            <b className="fs-4">Skills</b>
            <br />
            <CompetenciesSection />
            <br />
            <br />
            <b className="fs-4">Languages</b>
            <br />
            <span>
              French: Native
              <br /> English: C1+
              <br /> German: B1+
            </span>
            <br />
            <br />
            <b className="fs-4">Interests</b>
            <br />
            <span>Photography • Sports • DIY</span>
          </CardBody>
        </Card>
      </Col>
      <Col className="overflow-auto" style={{ maxHeight: '92vh' }}>
        <ProjectsSection />
      </Col>
    </Row>
  );
}
