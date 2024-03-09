import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gateway } from 'app.gateway';
import { type Model } from 'mongoose';
import { Project, type ProjectDocument } from 'project/project.schema';
import {
  type CreateOrganizationDto,
  type UpdateOrganizationDto,
} from './organization.dto';
import { Organization, type OrganizationDocument } from './organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
    private gateway: Gateway,
  ) {}

  async getAll(): Promise<OrganizationDocument[]> {
    return await this.organizationModel.find().exec();
  }

  async create(
    organization: CreateOrganizationDto,
  ): Promise<OrganizationDocument> {
    const createdOrganization = new this.organizationModel(organization);
    await createdOrganization.save().catch((error) => {
      throw error;
    });
    this.gateway.server.emit('organizationAdded', createdOrganization);
    return createdOrganization;
  }

  async update(
    id: string,
    organization: UpdateOrganizationDto,
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

    return await this.organizationModel
      .findByIdAndDelete(id, {
        returnDocument: 'after',
      })
      .exec();
  }
}
