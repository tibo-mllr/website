import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DataService } from './data.service';
import { Data } from './schemas/data.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  getData(): Promise<Data[]> {
    return this.dataService.getData();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createData(@Body() data: Data): Promise<Data> {
    return this.dataService.createData(data);
  }
}
