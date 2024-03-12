import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { type Resume } from './resume.entity';
import { ResumeService } from './resume.service';

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  @ApiOperation({
    description: 'Get a resume-like presentation of the projects',
  })
  async getResume(): Promise<Resume> {
    return this.resumeService.getResume();
  }
}
