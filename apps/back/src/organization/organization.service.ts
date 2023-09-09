import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Organization,
  OrganizationDocument,
  ProjectDocument,
} from '@website/shared-types';
import { Model } from 'mongoose';
import { Gateway } from 'src/app.gateway';
import { ProjectClass } from 'src/project/project.schema';
import { OrganizationClass } from './organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(OrganizationClass.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(ProjectClass.name)
    private projectModel: Model<ProjectDocument>,
    private gateway: Gateway,
  ) {}

  async getAll(): Promise<OrganizationDocument[]> {
    return await this.organizationModel.find().exec();
  }

  async create(organization: Organization): Promise<OrganizationDocument> {
    const createdOrganization = new this.organizationModel(organization);
    await createdOrganization.save().catch((error) => {
      throw error;
    });
    this.gateway.server.emit('organizationAdded', createdOrganization);
    return createdOrganization;
  }

  async update(
    id: string,
    organization: Organization,
  ): Promise<OrganizationDocument> {
    await this.organizationModel.findByIdAndUpdate(id, organization);
    const editedOrganization = await this.organizationModel.findById(id);
    this.gateway.server.emit('organizationEdited', editedOrganization);
    return editedOrganization;
  }

  async delete(id: string): Promise<OrganizationDocument> {
    await this.projectModel.deleteMany({ organization: id });
    this.gateway.server.emit('projectsDeleted');
    this.gateway.server.emit('organizationDeleted', id);
    return await this.organizationModel.findByIdAndDelete(id);
  }
}
