import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ index: { unique: true } })
  userId: number;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  hashedPassword: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
