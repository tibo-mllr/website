import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { News, NewsDocument } from './news.schema';
import { Model } from 'mongoose';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<NewsDocument>) {}

  async getAll(): Promise<NewsDocument[]> {
    return await this.newsModel
      .find()
      .sort({ date: 'desc' })
      .populate('author', 'username')
      .populate('editor', 'username')
      .exec();
  }

  async create(news: News, userId: string): Promise<NewsDocument> {
    const createdNews = new this.newsModel({ ...news, author: userId });
    await createdNews.save().catch((error) => {
      throw error;
    });
    return createdNews.populate('author', 'username');
  }

  async update(
    id: string,
    newNews: NewsDocument,
    userId: string,
  ): Promise<NewsDocument> {
    await this.newsModel.findByIdAndUpdate(id, {
      ...newNews,
      edited: true,
      editor: userId,
    });
    return await this.newsModel
      .findById(id)
      .populate('author', 'username')
      .populate('editor', 'username');
  }

  async delete(id: string): Promise<NewsDocument> {
    return await this.newsModel.findByIdAndDelete(id);
  }
}
