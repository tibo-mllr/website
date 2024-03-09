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
import { UserRole } from '@website/shared-types';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { RoleGuard, Roles } from 'auth/role.guard';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { type ProjectDocument } from './project.schema';
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
  async create(@Body() project: CreateProjectDto): Promise<ProjectDocument> {
    return await this.projectService.create(project).catch((error) => {
      throw error;
    });
  }

  @Put('/:id')
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() project: UpdateProjectDto,
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
