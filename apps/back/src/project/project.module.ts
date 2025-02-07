import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProjectController } from './project.controller';
import { Project, ProjectSchema } from './project.schema';
import { ProjectService } from './project.service';
import { Gateway } from 'app.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, Gateway],
})
export class ProjectModule {}
