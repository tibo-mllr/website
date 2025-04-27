'use client';

import { Card, CardContent, CardHeader } from '@mui/material';
import { type ReactElement } from 'react';

export function OrganizationCardSkeleton(): ReactElement {
  return (
    <div className="my-3">
      <Card>
        <CardHeader
          title={<div className="skeleton-text" style={{ width: '100%' }} />}
        />
        <CardContent>
          <div
            className="skeleton-text"
            style={{
              width: '100%',
              marginBottom: '10px',
            }}
          />
          <div
            className="skeleton-text"
            style={{
              width: '80%',
              marginBottom: '10px',
            }}
          />
          <div
            className="skeleton-text"
            style={{
              width: '90%',
              marginBottom: '10px',
            }}
          />
          <div
            className="skeleton-text"
            style={{
              width: '80%',
              marginBottom: '10px',
            }}
          />
          <div
            className="skeleton-text"
            style={{
              width: '90%',
              marginBottom: '10px',
            }}
          />
          <br />
          <br />
          <div
            className="skeleton-text"
            style={{
              width: '20%',
              marginBottom: '10px',
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
