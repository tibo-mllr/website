import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument } from 'mongoose';

import { type Organization as OrganizationType } from '@website/shared-types';

export type OrganizationDocument = HydratedDocument<OrganizationType>;

@Schema()
export class Organization {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  website: string;
}

export const OrganizationSchema =
  SchemaFactory.createForClass<OrganizationType>(Organization);
