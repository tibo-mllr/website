import axios from 'axios';

export const baseURL = 'http://localhost:8000';
export const client = axios.create({
  baseURL: baseURL,
});

export type Data = {
  name: string;
  content: string;
  date: Date;
};
