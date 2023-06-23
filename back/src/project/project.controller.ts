import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project, ProjectDocument } from './project.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async getAll(): Promise<ProjectDocument[]> {
    return await this.projectService.getAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() project: Project): Promise<ProjectDocument> {
    return await this.projectService.create(project).catch((error) => {
      throw new Error(error);
    });
  }
}
