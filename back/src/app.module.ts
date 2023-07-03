import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsModule } from './news/news.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { AppController } from './app.controller';
import { ProjectModule } from './project/project.module';
import { OrganizationModule } from './organization/organization.module';
import { ResumeModule } from './resume/resume.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    NewsModule,
    AuthModule,
    UsersModule,
    ProjectModule,
    OrganizationModule,
    ResumeModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
