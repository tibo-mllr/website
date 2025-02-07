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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserRole } from '@website/shared-types';

import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { type ProjectDocument } from './project.schema';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { RoleGuard, Roles } from 'auth/role.guard';

@ApiTags('Projects')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ description: 'Get all projects' })
  async getAll(): Promise<ProjectDocument[]> {
    return await this.projectService.getAll();
  }

  @Get('/competencies')
  @ApiOperation({ description: 'Get a set of all competencies' })
  async getCompetencies(): Promise<string[]> {
    return await this.projectService.getCompetencies();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Create a new project' })
  async create(@Body() project: CreateProjectDto): Promise<ProjectDocument> {
    return await this.projectService.create(project).catch((error) => {
      throw error;
    });
  }

  @Put('/:id')
  @ApiBearerAuth()
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Update a project' })
  async update(
    @Param('id') id: string,
    @Body() project: UpdateProjectDto,
  ): Promise<ProjectDocument> {
    return await this.projectService.update(id, project).catch((error) => {
      throw error;
    });
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Delete a project' })
  async delete(@Param('id') id: string): Promise<ProjectDocument> {
    return await this.projectService.delete(id);
  }
}
