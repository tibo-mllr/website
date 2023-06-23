import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Organization } from 'src/organization/organization.schema';

export type ProjectDocument = HydratedDocument<Project>;

enum ProjectType {
  Education = 'Education',
  Tech = 'Tech Experiences',
  Personal = 'Personal Projects',
}

@Schema()
export class Project {
  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Organization.name })
  organization: Organization | Types.ObjectId;

  @Prop({ required: true, enum: ProjectType })
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
