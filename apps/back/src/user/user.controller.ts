import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  type RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@website/shared-types';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { RoleGuard, Roles } from 'auth/role.guard';
import { CreateSelfUserDto, CreateUserDto, UpdateUserDto } from './user.dto';
import { type UserDocument } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('/superAdmin')
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAll(): Promise<UserDocument[]> {
    return await this.userService.getAll();
  }

  @Get('/admin')
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getSelf(
    @Req()
    req: RawBodyRequest<{
      user: {
        _id: string;
        username: string;
        role: string;
      };
    }>,
  ): Promise<UserDocument[]> {
    return [await this.userService.getSelf(req.user._id)];
  }

  @Post()
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(@Body() user: CreateUserDto): Promise<UserDocument> {
    return await this.userService.create(user).catch((error) => {
      throw error;
    });
  }

  @Post('/new')
  async createSelf(@Body() user: CreateSelfUserDto): Promise<UserDocument> {
    return await this.userService.createSelf(user).catch((error) => {
      throw error;
    });
  }

  @Put('/:id')
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<UserDocument> {
    return await this.userService.update(id, user).catch((error) => {
      throw error;
    });
  }

  @Delete('/:id')
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async delete(@Param('id') id: number): Promise<UserDocument> {
    return await this.userService.delete(id);
  }
}
