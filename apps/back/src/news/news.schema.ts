import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { News as NewsType } from '@website/shared-types';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'user/user.schema';

export type NewsDocument = HydratedDocument<NewsType>;

@Schema()
export class News {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  author: User;

  @Prop({ default: false })
  edited: boolean;

  @Prop({ default: null, type: Types.ObjectId, ref: User.name })
  editor: User;
}

export const NewsSchema = SchemaFactory.createForClass<NewsType>(News);
