import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Project, ProjectType } from '@website/shared-types';
import { HydratedDocument, Types } from 'mongoose';
import { OrganizationClass } from 'src/organization/organization.schema';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class ProjectClass {
  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Types.ObjectId, ref: OrganizationClass.name })
  organization: OrganizationClass;

  @Prop({ required: true, enum: ProjectType, type: String })
  type: ProjectType;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ required: true })
  description: string;

  @Prop()
  link: string;

  @Prop({ required: true, default: [] })
  competencies: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(ProjectClass);
