import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Project as ProjectTyping, ProjectType } from '@website/shared-types';
import { HydratedDocument, Types } from 'mongoose';
import { Organization } from 'organization/organization.schema';

export type ProjectDocument = HydratedDocument<ProjectTyping>;

@Schema()
export class Project {
  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Organization.name })
  organization: Organization;

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

export const ProjectSchema = SchemaFactory.createForClass(Project);
