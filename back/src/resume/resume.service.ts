import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from 'src/organization/organization.schema';
import {
  Project,
  ProjectDocument,
  ProjectType,
} from 'src/project/project.schema';
import { Resume } from './resume.entity';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async getResume(): Promise<Resume> {
    const types = await this.projectModel
      .aggregate([
        {
          $group: {
            _id: '$type',
            projects: { $push: '$$ROOT' },
          },
        },
      ])
      .exec();

    for (const type of types) {
      type.projects = type.projects.sort(
        (a: ProjectDocument, b: ProjectDocument) => {
          return !a.endDate
            ? -1
            : !b.endDate
            ? 1
            : b.endDate > a.endDate
            ? 1
            : -1;
        },
      );
      for (const project of type.projects) {
        project.organization = await this.organizationModel
          .findOne({ _id: project.organization })
          .exec();
      }
    }

    const competencies = await this.projectModel
      .find({}, { competencies: 1 })
      .exec();

    return {
      projects: types as {
        _id: ProjectType;
        projects: ProjectDocument[];
      }[],
      competencies: competencies,
    };
  }
}
