import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  OrganizationDocument,
  ProjectDocument,
  ProjectType,
  Resume,
} from '@website/shared-types';
import { Model } from 'mongoose';
import { OrganizationClass } from 'src/organization/organization.schema';
import { ProjectClass } from 'src/project/project.schema';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(ProjectClass.name)
    private projectModel: Model<ProjectDocument>,
    @InjectModel(OrganizationClass.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async getResume(): Promise<Resume> {
    const types = await this.projectModel
      .aggregate([
        { $sort: { startDate: -1 } },
        { $sort: { endDate: 1 } },
        {
          $match: {
            $or: [
              {
                endDate: {
                  $gt: new Date(
                    new Date().setFullYear(new Date().getFullYear() - 2),
                  ),
                },
              },
              { endDate: undefined },
            ],
          },
        },
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
      .distinct('competencies')
      .exec();

    return {
      projects: types as {
        type: ProjectType;
        projects: ProjectDocument[];
      }[],
      competencies: competencies,
    };
  }
}
