'use client';

import { type ReactElement } from 'react';
import { Card } from 'react-bootstrap';

export function OrganizationCardSkeleton(): ReactElement {
  return (
    <div className="my-3">
      <Card>
        <Card.Header>
          <Card.Title>
            <div className="skeleton-text" style={{ width: '10%' }} />
          </Card.Title>
        </Card.Header>
        <Card.Body>
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
        </Card.Body>
      </Card>
    </div>
  );
}
