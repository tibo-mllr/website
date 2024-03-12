import {
  Controller,
  Post,
  Request,
  type RawBodyRequest,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type UserRole } from '@website/shared-types';
import { AuthService } from 'auth/auth.service';
import { LocalAuthGuard } from 'auth/local-auth.guard';
import { LoginUserDto } from 'user/user.dto';
import { UserDocument } from 'user/user.schema';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @ApiTags('Auth')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  @ApiOperation({ description: 'Login' })
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
