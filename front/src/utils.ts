import axios from 'axios';

export const baseURL = 'http://localhost:8000';
export const client = axios.create({
  baseURL: baseURL,
});

export type News = {
  title: string;
  content: string;
  date: Date;
  edited?: boolean;
};

export type NewsDocument = News & {
  _id: string;
};

export enum Role {
  Admin = 'admin',
  SuperAdmin = 'superAdmin',
}

export type User = {
  role: Role;
  username: string;
  password: string;
};

export type UserDocument = User & {
  _id: string;
};
