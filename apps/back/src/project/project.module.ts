import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Gateway } from 'src/app.gateway';
import { ProjectController } from './project.controller';
import { ProjectClass, ProjectSchema } from './project.schema';
import { ProjectService } from './project.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectClass.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, Gateway],
})
export class ProjectModule {}
