import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Gateway } from 'app.gateway';
import { NewsController } from './news.controller';
import { NewsClass, NewsSchema } from './news.schema';
import { NewsService } from './news.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NewsClass.name, schema: NewsSchema }]),
  ],
  controllers: [NewsController],
  providers: [NewsService, Gateway],
})
export class NewsModule {}
