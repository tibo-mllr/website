import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User as UserType, UserRole } from '@website/shared-types';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserType>;

@Schema()
export class User {
  @Prop({ required: true })
  role: UserRole;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  hashedPassword: string;
}

export const UserSchema = SchemaFactory.createForClass<UserType>(User);
