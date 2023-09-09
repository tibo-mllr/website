import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { News, NewsDocument } from '@website/shared-types';
import { Model } from 'mongoose';
import { Gateway } from 'src/app.gateway';
import { NewsClass } from './news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(NewsClass.name) private newsModel: Model<NewsDocument>,
    private gateway: Gateway,
  ) {}

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
    await createdNews.populate('author', 'username');
    this.gateway.server.emit('newsAdded', createdNews);
    return createdNews;
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
    const editedNews = await this.newsModel
      .findById(id)
      .populate('author', 'username')
      .populate('editor', 'username');
    this.gateway.server.emit('newsEdited', editedNews);
    return editedNews;
  }

  async delete(id: string): Promise<NewsDocument> {
    this.gateway.server.emit('newsDeleted', id);
    return await this.newsModel.findByIdAndDelete(id);
  }
}
