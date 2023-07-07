import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from './news.schema';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { Gateway } from 'src/app.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
  ],
  controllers: [NewsController],
  providers: [NewsService, Gateway],
})
export class NewsModule {}
