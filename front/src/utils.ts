import axios from 'axios';

export const baseURL = 'http://localhost:8000';
export const client = axios.create({
  baseURL: baseURL,
});

export type FormErrors = {
  [key: string]: string;
};

export type Organization = {
  name: string;
  description: string;
  location: string;
  website: string;
};

export type OrganizationDocument = Organization & {
  _id: string;
};
