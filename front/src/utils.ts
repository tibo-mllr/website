import axios from 'axios';

export const baseURL = 'http://localhost:8000';
export const client = axios.create({
  baseURL: baseURL,
});

export type FormErrors = {
  [key: string]: string;
};
