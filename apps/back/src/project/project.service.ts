import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from '@website/shared-types';
import { Gateway } from 'app.gateway';
import { Model } from 'mongoose';
import { ProjectClass, ProjectDocument } from './project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(ProjectClass.name)
    private projectModel: Model<ProjectDocument>,
    private gateway: Gateway,
  ) {}

  async getAll(): Promise<ProjectDocument[]> {
    return await this.projectModel.find().populate('organization').exec();
  }

  async getCompetencies(): Promise<string[]> {
    return await this.projectModel.distinct('competencies').exec();
  }

  async create(project: Project): Promise<ProjectDocument> {
    const createdProject = new this.projectModel(project);
    await createdProject.save().catch((error) => {
      throw error;
    });
    await createdProject.populate('organization');
    this.gateway.server.emit('projectAdded', createdProject);
    return createdProject;
  }

  async update(id: string, project: Project): Promise<ProjectDocument> {
    await this.projectModel.findByIdAndUpdate(id, project);
    const editedProject = await this.projectModel
      .findById(id)
      .populate('organization');
    this.gateway.server.emit('projectEdited', editedProject);
    return editedProject;
  }

  async delete(id: string): Promise<ProjectDocument> {
    this.gateway.server.emit('projectDeleted', id);
    return await this.projectModel.findByIdAndDelete(id);
  }
}
