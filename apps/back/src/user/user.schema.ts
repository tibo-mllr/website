import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User, UserRole } from '@website/shared-types';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class UserClass {
  @Prop({ required: true })
  role: UserRole;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  hashedPassword: string;
}

export const UserSchema = SchemaFactory.createForClass<User>(UserClass);
