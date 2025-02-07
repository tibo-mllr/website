import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import {
  Organization,
  OrganizationSchema,
} from 'organization/organization.schema';
import { Project, ProjectSchema } from 'project/project.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
    ]),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
