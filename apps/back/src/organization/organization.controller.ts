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
import { Organization, UserRole } from '@website/shared-types';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard, Roles } from 'src/auth/role.guard';
import { OrganizationDocument } from './organization.schema';
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
    @Body() organization: Organization,
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
    @Body() organization: Organization,
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
