import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from 'app.controller';
import { AuthModule } from 'auth/auth.module';
import { NewsModule } from 'news/news.module';
import { OrganizationModule } from 'organization/organization.module';
import { ProjectModule } from 'project/project.module';
import { ResumeModule } from 'resume/resume.module';
import { DB_HOST } from 'settings';
import { UsersModule } from 'user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${DB_HOST}:27017/nest`),
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
