import {
  Controller,
  Post,
  Request,
  RawBodyRequest,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(
    @Request()
    req: RawBodyRequest<{ user: { username: string; userId: number } }>,
  ): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }
}
