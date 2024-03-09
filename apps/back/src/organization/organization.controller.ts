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
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './organization.dto';
import { type OrganizationDocument } from './organization.schema';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  async getAll(): Promise<OrganizationDocument[]> {
    return await this.organizationService.getAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
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
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
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
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async delete(@Param('id') id: string): Promise<OrganizationDocument> {
    return await this.organizationService.delete(id);
  }
}
