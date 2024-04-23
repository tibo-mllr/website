'use client';

import { TextFieldWithLabel, TypeaheadField } from '@/components';
import { selectOrganizations } from '@/lib/redux/slices';
import {
  type OrganizationDocument,
  type Project,
  type ProjectDocument,
} from '@/lib/utils';
import { type Organization } from '@website/shared-types';
import { useFormikContext } from 'formik';
import { type ReactElement } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export default function OrganizationSection<
  T extends
    | (ProjectDocument & { organization: OrganizationDocument })
    | Project,
>(): ReactElement {
  const { setFieldValue } = useFormikContext<T>();

  const organizations = useSelector(selectOrganizations);

  return (
    <Card className="mb-3 p-2">
      <Card.Title>Organization</Card.Title>
      <Row>
        <Col md={4}>
          <TypeaheadField
            name="organization.name"
            label="Name"
            allowNew
            onSelected={(selected) => {
              if ((selected as OrganizationDocument)._id)
                setFieldValue('organization', selected);
              else
                setFieldValue('organization', {
                  name: (selected as Organization).name,
                  description: '',
                  location: '',
                  website: '',
                });
            }}
            groupClassName="mb-3"
            options={organizations}
            placeholder="Organization"
            labelKey="name"
          />
        </Col>
        <Col md={4}>
          <TextFieldWithLabel
            name="organization.location"
            label="Location"
            placeholder="Location"
            groupClassName="mb-3"
            floating={false}
          />
        </Col>
        <Col md={4}>
          <TextFieldWithLabel
            name="organization.website"
            label="Website"
            placeholder="Website"
            groupClassName="mb-3"
            floating={false}
          />
        </Col>
        <Col>
          <TextFieldWithLabel
            as="textarea"
            name="organization.description"
            label="Description"
            placeholder="Description"
            style={{ height: '10vh' }}
          />
        </Col>
      </Row>
    </Card>
  );
}
