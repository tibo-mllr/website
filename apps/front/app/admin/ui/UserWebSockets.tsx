'use client';

import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react';

import { API } from '@/lib/api';
import { FrontUserDocument } from '@/lib/utils';

type UserWebSocketsProps = {
  setUsers: Dispatch<SetStateAction<FrontUserDocument[]>>;
};

export function UserWebSockets({
  setUsers,
}: UserWebSocketsProps): ReactElement {
  const addUser = useCallback<(newUser: FrontUserDocument) => void>(
    (newUser) => setUsers((prev) => [...prev, newUser]),
    [setUsers],
  );

  const deleteUser = useCallback<(id: string) => void>(
    (id) => setUsers((prev) => prev.filter((user) => user._id !== id)),
    [setUsers],
  );

  const editUser = useCallback<(editedUser: FrontUserDocument) => void>(
    (editedUser) =>
      setUsers((prev) =>
        prev.map((user) => (user._id === editedUser._id ? editedUser : user)),
      ),
    [setUsers],
  );

  useEffect(() => {
    API.listenTo('userAdded', (newUser: FrontUserDocument) => addUser(newUser));
    API.listenTo('userEdited', (editedUser: FrontUserDocument) =>
      editUser(editedUser),
    );
    API.listenTo('userDeleted', (id: string) => deleteUser(id));

    return () => {
      API.stopListening('userAdded');
      API.stopListening('userEdited');
      API.stopListening('userDeleted');
    };
  }, [addUser, deleteUser, editUser]);

  return <></>;
}
