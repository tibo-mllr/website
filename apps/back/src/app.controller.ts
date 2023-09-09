import {
  Controller,
  Post,
  Request,
  RawBodyRequest,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@website/shared-types';
import { Types } from 'mongoose';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(
    @Request()
    req: RawBodyRequest<{
      user: { _doc: { username: string; _id: Types.ObjectId; role: UserRole } };
    }>,
  ): Promise<{ access_token: string; role: UserRole }> {
    return await this.authService.login(req.user._doc);
  }
}
