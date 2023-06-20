import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(
    @Body() signInDTto: Partial<User>,
  ): Promise<{ access_token: Promise<string> }> {
    return this.authService.signIn(signInDTto.username, signInDTto.password);
  }
}
