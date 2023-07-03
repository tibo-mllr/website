import { Controller, Get } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { Resume } from './resume.entity';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  async getResume(): Promise<Resume> {
    return this.resumeService.getResume();
  }
}
