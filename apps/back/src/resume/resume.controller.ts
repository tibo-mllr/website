import { Controller, Get } from '@nestjs/common';
import { type Resume } from './resume.entity';
import { ResumeService } from './resume.service';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  async getResume(): Promise<Resume> {
    return this.resumeService.getResume();
  }
}
