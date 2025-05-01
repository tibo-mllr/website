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

import { API } from '@/lib/api';
import { selectUserRole } from '@/lib/redux/slices';
import { type FrontUserDocument } from '@/lib/utils';

import { CreateUserModal, UserActions, UserWebSockets } from '../ui';

export default function AdminView(): ReactElement {
  const [users, setUsers] = useState<FrontUserDocument[]>([]);

  const userRole = useSelector(selectUserRole);

  useEffect(() => {
    API.getUsers(userRole).then(setUsers);
  }, [userRole]);

  return (
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
  );
}
