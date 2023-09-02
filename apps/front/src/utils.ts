import axios from 'axios';
import { io } from 'socket.io-client';

export const baseURL = 'http://localhost:8000';
export const client = axios.create({
  baseURL: baseURL,
});

export type FormErrors = {
  [key: string]: string;
};

export const socket = io(baseURL);
