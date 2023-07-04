import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './project.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async getAll(): Promise<ProjectDocument[]> {
    return await this.projectModel.find().populate('organization').exec();
  }

  async create(project: Project): Promise<ProjectDocument> {
    const createdProject = new this.projectModel(project);
    await createdProject.save().catch((error) => {
      throw new Error(error);
    });
    return createdProject;
  }

  async update(id: string, project: Project): Promise<ProjectDocument> {
    return await this.projectModel.findByIdAndUpdate(id, project);
  }

  async delete(id: string): Promise<ProjectDocument> {
    return await this.projectModel.findByIdAndDelete(id);
  }
}
