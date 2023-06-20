import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataModule } from './data/data.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest'),
    DataModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
