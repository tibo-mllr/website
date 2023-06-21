import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DataDocument = HydratedDocument<Data>;

@Schema()
export class Data {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  date: Date;
}

export const DataSchema = SchemaFactory.createForClass(Data);
