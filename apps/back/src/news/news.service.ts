import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gateway } from 'app.gateway';
import { type Model } from 'mongoose';
import { type CreateNewsDto, type UpdateNewsDto } from './news.dto';
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

  async create(news: CreateNewsDto, userId: string): Promise<NewsDocument> {
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
    newNews: UpdateNewsDto,
    userId: string,
  ): Promise<NewsDocument> {
    const editedNews = await this.newsModel
      .findByIdAndUpdate(
        id,
        {
          ...newNews,
          edited: true,
          editor: userId,
        },
        { returnDocument: 'after' },
      )
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
