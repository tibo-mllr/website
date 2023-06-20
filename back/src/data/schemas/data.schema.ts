import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DataDocument = HydratedDocument<Data>;

@Schema()
export class Data {
  @Prop()
  name: string;

  @Prop()
  content: string;
}

export const DataSchema = SchemaFactory.createForClass(Data);
