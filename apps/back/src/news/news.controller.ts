import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  type RawBodyRequest,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type News, UserRole } from '@website/shared-types';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { RoleGuard, Roles } from 'auth/role.guard';
import { CreateNewsDto, UpdateNewsDto } from './news.dto';
import { NewsService } from './news.service';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ description: 'Get all news' })
  async getAll(): Promise<News[]> {
    return await this.newsService.getAll();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Create a news' })
  async create(
    @Body() news: CreateNewsDto,
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
  @ApiBearerAuth()
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Update a news' })
  async update(
    @Param('id') id: string,
    @Body() newNews: UpdateNewsDto,
    @Request() req: RawBodyRequest<{ user: { _id: string } }>,
  ): Promise<News> {
    return await this.newsService.update(id, newNews, req.user._id);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Delete a news' })
  async delete(@Param('id') id: string): Promise<News> {
    return await this.newsService.delete(id);
  }
}
