import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type NewsDocument = HydratedDocument<News>;

@Schema()
export class News {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ default: false })
  edited: boolean;
}

export const NewsSchema = SchemaFactory.createForClass(News);
