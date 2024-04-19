import { UserRole } from '@website/shared-types';
import axios from 'axios';
import { io } from 'socket.io-client';

export const baseURL = 'http://localhost:8000';
export const client = axios.create({
  baseURL: baseURL,
});

export function setAuth(token: string, userRole: UserRole): void {
  sessionStorage.setItem('token', token);
  sessionStorage.setItem('userRole', userRole);
  client.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function removeAuth(): void {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('userRole');
  delete client.defaults.headers.common.Authorization;
}

export type FormErrors = {
  [key: string]: string;
};

export const socket = io(baseURL);

export const DOCUMENT_TITLE = 'Website project';
