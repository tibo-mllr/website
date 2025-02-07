import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrganizationController } from './organization.controller';
import { Organization, OrganizationSchema } from './organization.schema';
import { OrganizationService } from './organization.service';
import { Gateway } from 'app.gateway';
import { Project, ProjectSchema } from 'project/project.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, Gateway],
})
export class OrganizationModule {}
