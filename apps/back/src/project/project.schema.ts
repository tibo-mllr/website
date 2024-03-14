import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  type Project as ProjectTyping,
  ProjectType,
} from '@website/shared-types';
import { type HydratedDocument, Types } from 'mongoose';
import { Organization } from 'organization/organization.schema';

export type ProjectDocument = HydratedDocument<ProjectTyping>;

@Schema()
export class Project {
  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: Organization.name })
  organization?: Organization;

  @Prop({ required: true, enum: ProjectType, type: String })
  type: ProjectType;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop({ required: true })
  description: string;

  @Prop()
  link?: string;

  @Prop({ required: true, default: [] })
  competencies: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
