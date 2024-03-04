import {
  Controller,
  Post,
  Request,
  type RawBodyRequest,
  UseGuards,
} from '@nestjs/common';
import { type UserRole } from '@website/shared-types';
import { AuthService } from 'auth/auth.service';
import { LocalAuthGuard } from 'auth/local-auth.guard';
import { type UserDocument } from 'user/user.schema';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(
    @Request()
    req: RawBodyRequest<{
      user: { _doc: Partial<UserDocument> };
    }>,
  ): Promise<{ access_token: string; role: UserRole }> {
    return await this.authService.login(req.user._doc);
  }
}
