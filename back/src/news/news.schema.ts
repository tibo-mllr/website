import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/user.schema';

export type NewsDocument = HydratedDocument<News>;

@Schema()
export class News {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  author: User | Types.ObjectId;

  @Prop({ default: false })
  edited: boolean;

  @Prop({ default: null, type: Types.ObjectId, ref: User.name })
  editor: User | Types.ObjectId;
}

export const NewsSchema = SchemaFactory.createForClass(News);
