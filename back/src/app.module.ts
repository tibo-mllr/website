import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataModule } from './data/data.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    DataModule,
    AuthModule,
    UsersModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
