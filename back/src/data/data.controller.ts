import { Body, Controller, Get, Post } from '@nestjs/common';
import { DataService } from './data.service';
import { Data } from './schemas/data.schema';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  getData(): Promise<Data[]> {
    return this.dataService.getData();
  }

  @Post()
  createData(@Body() data: Data): Promise<Data> {
    return this.dataService.createData(data);
  }
}
