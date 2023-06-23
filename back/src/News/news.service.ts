import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { News, NewsDocument } from './news.schema';
import { Model } from 'mongoose';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<NewsDocument>) {}

  async getAllNews(): Promise<NewsDocument[]> {
    return await this.newsModel.find().sort({ date: 'desc' }).exec();
  }

  async createNews(news: News): Promise<NewsDocument> {
    const createdNews = new this.newsModel({
      title: news.title,
      content: news.content,
      date: news.date,
    });
    await createdNews.save().catch((error) => {
      throw new Error(error);
    });
    return createdNews;
  }

  async updateNews(id: string, newNews: NewsDocument): Promise<NewsDocument> {
    return await this.newsModel.findByIdAndUpdate(id, {
      ...newNews,
      edited: true,
    });
  }

  async deleteNews(id: string): Promise<NewsDocument> {
    return await this.newsModel.findByIdAndDelete(id);
  }
}
