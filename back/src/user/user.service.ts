import { ConflictException, Injectable } from '@nestjs/common';
import { NewUser, User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';
import { News, NewsDocument } from 'src/news/news.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(News.name) private newsModel: Model<NewsDocument>,
  ) {}

  async get(username: string): Promise<UserDocument | undefined> {
    return await this.userModel.findOne({ username }).exec();
  }

  async getSelf(id: string): Promise<UserDocument | undefined> {
    return await this.userModel.findById(id, { hashedPassword: 0 }).exec();
  }

  async getAll(): Promise<UserDocument[]> {
    return await this.userModel.find({}, { hashedPassword: 0 }).exec();
  }

  async create(newUser: NewUser): Promise<UserDocument> {
    const existingUser = await this.get(newUser.username);
    if (existingUser) {
      console.log(existingUser);
      throw new ConflictException('Username already used');
    }
    const hashedPassword = await hash(newUser.password, 8);
    const user = {
      role: newUser.role,
      username: newUser.username,
      hashedPassword: hashedPassword,
    };
    const createdUser = new this.userModel(user);
    await createdUser.save().catch((error) => {
      throw error;
    });

    return await this.getSelf(createdUser._id.toString());
  }

  async createSelf(newUser: NewUser): Promise<UserDocument> {
    const existingUser = await this.get(newUser.username);
    if (existingUser) {
      console.log(existingUser);
      throw new ConflictException('Username already used');
    }
    const hashedPassword = await hash(newUser.password, 8);
    const user = {
      role: 'admin',
      username: newUser.username,
      hashedPassword: hashedPassword,
    };
    const createdUser = new this.userModel(user);
    await createdUser.save().catch((error) => {
      throw error;
    });

    return await this.getSelf(createdUser._id.toString());
  }

  async update(id: string, user: NewUser): Promise<UserDocument> {
    if (user.password) {
      hash(user.password, 8, async (_, hashedPassword) => {
        const updatedUser = {
          role: user.role,
          username: user.username,
          hashedPassword: hashedPassword,
        };
        await this.userModel
          .findByIdAndUpdate(id, updatedUser)
          .catch((error) => {
            throw error;
          });
      });
      return await this.userModel.findById(id).exec();
    }
    const updatedUser = {
      role: user.role,
      username: user.username,
    };
    await this.userModel.findByIdAndUpdate(id, updatedUser).catch((error) => {
      throw error;
    });

    return await this.getSelf(id);
  }

  async delete(id: number): Promise<UserDocument> {
    await this.newsModel.deleteMany({ author: id }).exec();
    await this.newsModel.deleteMany({ editor: id }).exec();
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
