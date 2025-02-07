import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { Gateway } from 'app.gateway';
import { News, NewsSchema } from 'news/news.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
  ],
  providers: [UserService, Gateway],
  exports: [UserService],
  controllers: [UsersController],
})
export class UsersModule {}
