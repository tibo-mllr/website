import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { NewUser, UserDocument } from './user.schema';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role, RoleGuard, Roles } from 'src/auth/role.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAll(): Promise<UserDocument[]> {
    return await this.userService.findAll();
  }

  @Post()
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(@Body() user: NewUser): Promise<UserDocument> {
    const createdUser = await this.userService
      .create(user)
      .then((user) => {
        return user;
      })
      .catch((error) => {
        throw new Error(error);
      });

    return createdUser;
  }

  @Put('/:id')
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Param('id') id: number,
    @Body() user: NewUser,
  ): Promise<UserDocument> {
    const updatedUser = await this.userService
      .update(id, user)
      .then((user) => {
        return user;
      })
      .catch((error) => {
        throw new Error(error);
      });

    return updatedUser;
  }

  @Delete('/:id')
  @Roles(Role.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async delete(@Param('id') id: number): Promise<UserDocument> {
    return await this.userService.delete(id);
  }
}
