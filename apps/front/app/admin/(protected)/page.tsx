'use client';

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material';
import { useEffect, useState, type ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { CustomSuspense } from '@/components';
import { API } from '@/lib/api';
import { selectUserRole } from '@/lib/redux/slices';
import { type FrontUserDocument } from '@/lib/utils';

import {
  CreateUserModal,
  UserActions,
  UserCardSkeleton,
  UserWebSockets,
} from '../ui';

export default function AdminView(): ReactElement {
  const [users, setUsers] = useState<FrontUserDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userRole = useSelector(selectUserRole);

  useEffect(() => {
    API.getUsers(userRole)
      .then(setUsers)
      .finally(() => setIsLoading(false));
  }, [userRole]);

  return (
    <CustomSuspense
      isLoading={isLoading}
      fallback={
        <Grid container columns={{ xs: 4, sm: 9, md: 12 }}>
          <Grid size={{ xs: 2, sm: 3, md: 3 }}>
            <UserCardSkeleton />
          </Grid>
        </Grid>
      }
    >
      <Grid container columns={{ xs: 4, sm: 9, md: 12 }} spacing={3}>
        {users.map((user) => (
          <Grid key={user._id} size={{ xs: 2, sm: 3, md: 3 }}>
            <Card className="my-3">
              <CardHeader title={`User: ${user.username}`} />
              <CardContent>
                <Typography>Role: {user.role}</Typography>
              </CardContent>
              <CardActions>
                <UserActions user={user} />
              </CardActions>
            </Card>
          </Grid>
        ))}
        <CreateUserModal />
        <UserWebSockets setUsers={setUsers} />
      </Grid>
    </CustomSuspense>
  );
}
