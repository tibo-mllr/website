import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  RawBodyRequest,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { News, NewsDocument } from './news.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role, RoleGuard, Roles } from 'src/auth/role.guard';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getAll(): Promise<News[]> {
    return await this.newsService.getAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() news: News,
    @Request()
    req: RawBodyRequest<{
      user: { _id: string };
    }>,
  ): Promise<News> {
    return await this.newsService.create(news, req.user._id).catch((error) => {
      throw error;
    });
  }

  @Put('/:id')
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() newNews: NewsDocument,
    @Request() req: RawBodyRequest<{ user: { _id: string } }>,
  ): Promise<News> {
    return await this.newsService.update(id, newNews, req.user._id);
  }

  @Delete('/:id')
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async delete(@Param('id') id: string): Promise<News> {
    return await this.newsService.delete(id);
  }
}
