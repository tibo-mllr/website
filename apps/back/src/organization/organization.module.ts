import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Gateway } from 'app.gateway';
import { ProjectClass, ProjectSchema } from 'project/project.schema';
import { OrganizationController } from './organization.controller';
import { OrganizationClass, OrganizationSchema } from './organization.schema';
import { OrganizationService } from './organization.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrganizationClass.name, schema: OrganizationSchema },
    ]),
    MongooseModule.forFeature([
      { name: ProjectClass.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, Gateway],
})
export class OrganizationModule {}
