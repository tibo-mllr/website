import {
  Controller,
  Post,
  Request,
  RawBodyRequest,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Types } from 'mongoose';
import { Role } from './auth/role.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(
    @Request()
    req: RawBodyRequest<{
      user: { _doc: { username: string; _id: Types.ObjectId; role: Role } };
    }>,
  ): Promise<{ access_token: string; role: Role }> {
    return await this.authService.login(req.user._doc);
  }
}
