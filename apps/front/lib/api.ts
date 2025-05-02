import Axios from 'axios';
import { unstable_noStore as noStore } from 'next/cache';

import { FrontUser, News, Organization, UserRole } from '@website/shared-types';

import { io } from 'socket.io-client';

import {
  FrontUserDocument,
  NewsDocument,
  OrganizationDocument,
  Project,
  ProjectDocument,
  Resume,
} from './utils';

const baseURL = 'http://localhost:8000';

export class API {
  private static client = Axios.create({
    baseURL: baseURL,
  });

  private static socket = io(baseURL);

  // *** Socket ***

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static listenTo(eventName: string, callback: (...args: any[]) => void): void {
    this.socket.on(eventName, callback);
  }

  static stopListening(eventName: string): void {
    this.socket.off(eventName);
  }

  // *** AUTH ***

  static async login(
    username: string,
    password: string,
  ): Promise<{
    access_token: string;
    role: UserRole;
  }> {
    const { data } = await this.client.post<{
      access_token: string;
      role: UserRole;
    }>('/auth/login/', {
      username,
      password,
    });

    return data;
  }

  static setAuth(token: string): void {
    this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  static removeAuth(): void {
    delete this.client.defaults.headers.common.Authorization;
  }

  // *** Admin ***

  static async getUsers(
    userRole: UserRole | undefined,
  ): Promise<FrontUserDocument[]> {
    noStore();

    const { data } = await this.client.get<FrontUserDocument[]>(
      `/user/${userRole}`,
    );
    return data;
  }

  static async createUser(
    newUser: FrontUser,
    newSelf?: boolean,
  ): Promise<void> {
    await this.client.post(`/user${newSelf ? '/new' : ''}`, newUser);
  }

  static async editUser(
    id: string,
    user: FrontUserDocument,
    userRole: UserRole | undefined,
  ): Promise<void> {
    if (userRole === UserRole.SuperAdmin)
      await this.client.put(`/user/${id}`, user);
    else await this.client.put(`/user/self/${id}`, user);
  }

  static async deleteUser(id: string): Promise<void> {
    await this.client.delete(`/user/${id}`);
  }

  // *** News ***

  static async getNews(): Promise<NewsDocument[]> {
    noStore();

    const { data } = await this.client.get<NewsDocument[]>('/news');
    return data;
  }

  static async createNews(news: Omit<News, 'author'>): Promise<void> {
    await this.client.post('/news', news);
  }

  static async editNews(id: string, news: NewsDocument): Promise<void> {
    await this.client.put(`/news/${id}`, news);
  }

  static async deleteNews(id: string): Promise<void> {
    await this.client.delete(`/news/${id}`);
  }

  // *** Organizations ***

  static async getOrganizations(): Promise<OrganizationDocument[]> {
    noStore();

    const { data } =
      await this.client.get<OrganizationDocument[]>('/organization');
    return data;
  }

  static async createOrganization(
    organization: Organization,
  ): Promise<OrganizationDocument> {
    noStore();

    const { data } = await this.client.post<OrganizationDocument>(
      '/organization',
      organization,
    );

    return data;
  }

  static async editOrganization(
    id: string,
    organization: OrganizationDocument,
  ): Promise<OrganizationDocument> {
    noStore();

    const { data } = await this.client.put<OrganizationDocument>(
      `/organization/${id}`,
      organization,
    );

    return data;
  }

  static async deleteOrganization(id: string): Promise<void> {
    await this.client.delete(`/organization/${id}`);
  }

  // *** Projects ***

  static async getProjects(): Promise<ProjectDocument[]> {
    noStore();

    const { data } = await this.client.get<ProjectDocument[]>('/project');
    return data;
  }

  static async getCompetencies(): Promise<string[]> {
    noStore();

    const { data } = await this.client.get<string[]>('/project/competencies');
    return data;
  }

  static async getResume(): Promise<Resume> {
    noStore();

    const { data } = await this.client.get<Resume>('/resume');
    return data;
  }

  static async createProject(
    project: Omit<Project, 'organization'> & { organization?: string },
  ): Promise<void> {
    await this.client.post('/project', project);
  }

  static async editProject(
    id: string,
    project: Omit<Project, 'organization'> & { organization?: string },
  ): Promise<void> {
    await this.client.put(`/project/${id}`, project);
  }

  static async deleteProject(id: string): Promise<void> {
    await this.client.delete(`/project/${id}`);
  }
}
