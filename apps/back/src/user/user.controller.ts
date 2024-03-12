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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@website/shared-types';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';
import { RoleGuard, Roles } from 'auth/role.guard';
import { CreateSelfUserDto, CreateUserDto, UpdateUserDto } from './user.dto';
import { type UserDocument } from './user.schema';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('/superAdmin')
  @ApiBearerAuth()
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Get all users' })
  async getAll(): Promise<UserDocument[]> {
    return await this.userService.getAll();
  }

  @Get('/admin')
  @ApiBearerAuth()
  @Roles(UserRole.Admin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Get self user entity' })
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
  @ApiBearerAuth()
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Create a new user' })
  async create(@Body() user: CreateUserDto): Promise<UserDocument> {
    return await this.userService.create(user).catch((error) => {
      throw error;
    });
  }

  @Post('/new')
  @ApiOperation({ description: 'Create a new account for oneself' })
  async createSelf(@Body() user: CreateSelfUserDto): Promise<UserDocument> {
    return await this.userService.createSelf(user).catch((error) => {
      throw error;
    });
  }

  @Put('/:id')
  @ApiBearerAuth()
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Update a user' })
  async update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<UserDocument> {
    return await this.userService.update(id, user).catch((error) => {
      throw error;
    });
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @Roles(UserRole.SuperAdmin)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ description: 'Delete a user' })
  async delete(@Param('id') id: number): Promise<UserDocument> {
    return await this.userService.delete(id);
  }
}
