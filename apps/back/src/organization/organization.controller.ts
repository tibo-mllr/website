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

import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './organization.dto';
import { type OrganizationDocument } from './organization.schema';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { RoleGuard, Roles } from 'auth/role.guard';

@ApiTags('Organizations')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @ApiOperation({ description: 'Get all organizations' })
  async getAll(): Promise<OrganizationDocument[]> {
    return await this.organizationService.getAll();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Create a new organization' })
  async create(
    @Body() organization: CreateOrganizationDto,
  ): Promise<OrganizationDocument> {
    return await this.organizationService
      .create(organization)
      .catch((error) => {
        throw error;
      });
  }

  @Put('/:id')
  @ApiBearerAuth()
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Update an organization' })
  async update(
    @Param('id') id: string,
    @Body() organization: UpdateOrganizationDto,
  ): Promise<OrganizationDocument> {
    return await this.organizationService
      .update(id, organization)
      .catch((error) => {
        throw error;
      });
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Delete an organization' })
  async delete(@Param('id') id: string): Promise<OrganizationDocument> {
    return await this.organizationService.delete(id);
  }
}
