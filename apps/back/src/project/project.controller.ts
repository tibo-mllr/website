import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Project, ProjectDocument, UserRole } from '@website/shared-types';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard, Roles } from 'src/auth/role.guard';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async getAll(): Promise<ProjectDocument[]> {
    return await this.projectService.getAll();
  }

  @Get('/competencies')
  async getCompetencies(): Promise<string[]> {
    return await this.projectService.getCompetencies();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() project: Project): Promise<ProjectDocument> {
    return await this.projectService.create(project).catch((error) => {
      throw error;
    });
  }

  @Put('/:id')
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() project: Project,
  ): Promise<ProjectDocument> {
    return await this.projectService.update(id, project).catch((error) => {
      throw error;
    });
  }

  @Delete('/:id')
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async delete(@Param('id') id: string): Promise<ProjectDocument> {
    return await this.projectService.delete(id);
  }
}
