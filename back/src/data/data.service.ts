import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Data, DataDocument } from './schemas/data.schema';
import { Model } from 'mongoose';

@Injectable()
export class DataService {
  constructor(@InjectModel(Data.name) private dataModel: Model<DataDocument>) {}

  async getData(): Promise<Data[]> {
    return this.dataModel.find().exec();
  }

  async createData(data: Data): Promise<Data> {
    const createdData = new this.dataModel({
      name: data.name,
      content: data.content,
    });
    return createdData.save();
  }
}
