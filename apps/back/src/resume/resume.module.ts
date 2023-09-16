import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrganizationClass,
  OrganizationSchema,
} from 'organization/organization.schema';
import { ProjectClass, ProjectSchema } from 'project/project.schema';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectClass.name, schema: ProjectSchema },
    ]),
    MongooseModule.forFeature([
      { name: OrganizationClass.name, schema: OrganizationSchema },
    ]),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
