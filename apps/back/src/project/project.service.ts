import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gateway } from 'app.gateway';
import { type Model } from 'mongoose';
import { type CreateProjectDto, type UpdateProjectDto } from './project.dto';
import { Project, type ProjectDocument } from './project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
    private gateway: Gateway,
  ) {}

  async getAll(): Promise<ProjectDocument[]> {
    return await this.projectModel.find().populate('organization').exec();
  }

  async getCompetencies(): Promise<string[]> {
    return await this.projectModel.distinct('competencies').exec();
  }

  async create(project: CreateProjectDto): Promise<ProjectDocument> {
    const createdProject = new this.projectModel(project);
    await createdProject.save().catch((error) => {
      throw error;
    });
    await createdProject.populate('organization');
    this.gateway.server.emit('projectAdded', createdProject);
    return createdProject;
  }

  async update(
    id: string,
    project: UpdateProjectDto,
  ): Promise<ProjectDocument> {
    const editedProject = await this.projectModel
      .findByIdAndUpdate(
        id,
        {
          ...project,
          organization: project.organization ? project.organization : null,
        },
        { returnDocument: 'after' },
      )
      .populate('organization');

    this.gateway.server.emit('projectEdited', editedProject);
    return editedProject;
  }

  async delete(id: string): Promise<ProjectDocument> {
    this.gateway.server.emit('projectDeleted', id);

    return await this.projectModel
      .findByIdAndDelete(id, {
        returnDocument: 'after',
      })
      .exec();
  }
}
