import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UsersController } from './user.controller';
import { News, NewsSchema } from 'src/news/news.schema';
import { Gateway } from 'src/app.gateway';

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
