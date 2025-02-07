import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument } from 'mongoose';

import { UserRole, type User as UserType } from '@website/shared-types';

export type UserDocument = HydratedDocument<UserType>;

@Schema()
export class User {
  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  hashedPassword: string;
}

export const UserSchema = SchemaFactory.createForClass<UserType>(User);
