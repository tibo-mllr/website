import { ProjectType } from '@website/shared-types';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  organization: string;

  @IsNotEmpty()
  @IsEnum(ProjectType)
  type: ProjectType;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  endDate?: Date;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsUrl()
  @IsNotEmpty()
  link?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  competencies: string[];
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  role?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organization?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(ProjectType)
  type?: ProjectType;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  endDate?: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsUrl()
  @IsNotEmpty()
  link?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  competencies?: string[];
}
