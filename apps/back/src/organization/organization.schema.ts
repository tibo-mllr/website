import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Organization } from '@website/shared-types';

@Schema()
export class OrganizationClass {
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
  SchemaFactory.createForClass<Organization>(OrganizationClass);
