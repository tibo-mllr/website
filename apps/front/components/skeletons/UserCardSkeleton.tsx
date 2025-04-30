import { Card, CardContent, CardHeader } from '@mui/material';
import { type ReactElement } from 'react';

export function UserCardSkeleton(): ReactElement {
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
              width: '10%',
              marginBottom: '10px',
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
