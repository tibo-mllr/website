import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Organization, OrganizationSchema } from './organization.schema';
import { Project, ProjectSchema } from 'src/project/project.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
