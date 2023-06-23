import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  async getAllNews(): Promise<News[]> {
    return await this.newsService.getAllNews();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createNews(@Body() news: News): Promise<News> {
    return await this.newsService.createNews(news).catch((error) => {
      throw new Error(error);
    });
  }

  @Put('/:id')
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async modifyNews(
    @Param('id') id: string,
    @Body() newNews: NewsDocument,
  ): Promise<News> {
    return await this.newsService.updateNews(id, newNews);
  }

  @Delete('/:id')
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async deleteNews(@Param('id') id: string): Promise<News> {
    return await this.newsService.deleteNews(id);
  }
}
