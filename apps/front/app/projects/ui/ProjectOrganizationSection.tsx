'use client';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Modal,
  Typography,
} from '@mui/material';
import { ReactElement, useState } from 'react';

import { OrganizationDocument } from '@/lib/utils';

type ProjectOrganizationSectionProps = {
  organization: OrganizationDocument | undefined;
};

export function ProjectOrganizationSection({
  organization,
}: ProjectOrganizationSectionProps): ReactElement {
  const [showOrganization, setShowOrganization] = useState<boolean>(false);

  if (!organization) return <></>;

  return (
    <>
      <Typography
        variant="h5"
        component="button"
        onClick={() => setShowOrganization(true)}
      >
        <u>{organization.name}</u>
        {' | '}
      </Typography>
      <Modal open={showOrganization} onClose={() => setShowOrganization(false)}>
        <Box
          padding={2}
          width="fit"
          maxHeight="100vh"
          overflow="auto"
          position="absolute"
          left="50%"
          top="50%"
          sx={{ transform: 'translate(-50%, -100%)' }}
        >
          <Card>
            <CardHeader title={organization.name} />
            <CardContent>
              <p>
                <b>Location: </b>
                {organization.location}
              </p>
              <p>
                <b>Website: </b>
                <a href={organization.website} target="_blank" rel="noreferrer">
                  {organization.website}
                </a>
              </p>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </>
  );
}
