import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type News as NewsType } from '@website/shared-types';
import { Gateway } from 'app.gateway';
import { type Model } from 'mongoose';
import { News, type NewsDocument } from './news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
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

  async create(news: NewsType, userId: string): Promise<NewsDocument> {
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

    return await this.newsModel
      .findByIdAndDelete(id, {
        returnDocument: 'after',
      })
      .exec();
  }
}
