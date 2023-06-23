import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrganizationDocument = HydratedDocument<Organization>;

@Schema()
export class Organization {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  website: string;

  @Prop({ required: true })
  location: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
