import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization, OrganizationDocument } from './organization.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
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
    return await this.organizationModel.findByIdAndUpdate(id, organization);
  }

  async delete(id: string): Promise<OrganizationDocument> {
    return await this.organizationModel.findByIdAndDelete(id);
  }
}
