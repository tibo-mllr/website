import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { News } from '@website/shared-types';
import { HydratedDocument, Types } from 'mongoose';
import { UserClass } from 'user/user.schema';

export type NewsDocument = HydratedDocument<News>;

@Schema()
export class NewsClass {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: UserClass.name })
  author: UserClass;

  @Prop({ default: false })
  edited: boolean;

  @Prop({ default: null, type: Types.ObjectId, ref: UserClass.name })
  editor: UserClass;
}

export const NewsSchema = SchemaFactory.createForClass<News>(NewsClass);
