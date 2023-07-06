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
import { ProjectService } from './project.service';
import { Project, ProjectDocument } from './project.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role, RoleGuard, Roles } from 'src/auth/role.guard';

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
      throw error;
    });
  }

  @Put('/:id')
  @Roles(Role.SuperAdmin)
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
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async delete(@Param('id') id: string): Promise<ProjectDocument> {
    return await this.projectService.delete(id);
  }
}
