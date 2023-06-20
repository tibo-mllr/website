import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Data, DataSchema } from './schemas/data.schema';
import { DataController } from './data.controller';
import { DataService } from './data.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Data.name, schema: DataSchema }]),
  ],
  controllers: [DataController],
  providers: [DataService],
})
export class DataModule {}
