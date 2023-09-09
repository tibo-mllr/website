import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Gateway } from 'src/app.gateway';
import { NewsClass, NewsSchema } from 'src/news/news.schema';
import { UsersController } from './user.controller';
import { UserClass, UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserClass.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: NewsClass.name, schema: NewsSchema }]),
  ],
  providers: [UserService, Gateway],
  exports: [UserService],
  controllers: [UsersController],
})
export class UsersModule {}
