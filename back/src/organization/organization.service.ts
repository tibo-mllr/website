import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization, OrganizationDocument } from './organization.schema';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from 'src/project/project.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
  ) {}

  async getAll(): Promise<OrganizationDocument[]> {
    return await this.organizationModel.find().exec();
  }

  async create(organization: Organization): Promise<OrganizationDocument> {
    const createdOrganization = new this.organizationModel(organization);
    await createdOrganization.save().catch((error) => {
      throw new Error(error);
    });
    return createdOrganization;
  }

  async update(
    id: string,
    organization: Organization,
  ): Promise<OrganizationDocument> {
    await this.organizationModel.findByIdAndUpdate(id, organization);
    return await this.organizationModel.findById(id);
  }

  async delete(id: string): Promise<OrganizationDocument> {
    await this.projectModel.deleteMany({ organization: id });
    return await this.organizationModel.findByIdAndDelete(id);
  }
}
