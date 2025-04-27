import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
} from '@mui/material';
import Image from 'next/image';
import { type ReactElement } from 'react';

import { binIcon, editIcon } from '@/app/ui/assets';

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
        <CardActions>
          <Grid>
            <Grid>
              <Button>
                <Image
                  alt="Edit"
                  src={editIcon}
                  height="24"
                  className="d-inline-block align-center"
                />
              </Button>
            </Grid>
            <Grid className="d-flex justify-content-end">
              <Button>
                <Image
                  alt="Delete"
                  src={binIcon}
                  height="24"
                  className="d-inline-block align-center"
                />
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </div>
  );
}
