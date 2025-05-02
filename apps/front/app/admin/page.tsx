'use client';

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material';
import { redirect } from 'next/navigation';
import { useEffect, useState, type ReactElement } from 'react';

import { CustomSuspense } from '@/components';
import { useAuth } from '@/components/AuthProvider';
import { API } from '@/lib/api';
import { type FrontUserDocument } from '@/lib/utils';

import {
  CreateUserModal,
  UserActions,
  UserCardSkeleton,
  UserWebSockets,
} from './ui';

export default function AdminView(): ReactElement {
  const [users, setUsers] = useState<FrontUserDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isSet, token, userRole } = useAuth();

  useEffect(() => {
    if (isSet)
      API.getUsers(userRole)
        .then(setUsers)
        .finally(() => setIsLoading(false));
  }, [userRole, isSet]);

  if (!isSet) return <></>;

  if (!token) redirect('/');

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
