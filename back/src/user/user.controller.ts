import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NewUser, UserDocument } from './user.schema';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role, RoleGuard, Roles } from 'src/auth/role.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('/superAdmin')
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAll(): Promise<UserDocument[]> {
    return await this.userService.getAll();
  }

  @Get('/admin')
  @Roles(Role.Admin)
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
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(@Body() user: NewUser): Promise<UserDocument> {
    return await this.userService.create(user).catch((error) => {
      throw new Error(error);
    });
  }

  @Put('/:id')
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Param('id') id: string,
    @Body() user: NewUser,
  ): Promise<UserDocument> {
    return await this.userService.update(id, user).catch((error) => {
      throw new Error(error);
    });
  }

  @Delete('/:id')
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async delete(@Param('id') id: number): Promise<UserDocument> {
    return await this.userService.delete(id);
  }
}
