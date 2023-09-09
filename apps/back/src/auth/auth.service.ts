import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument, UserRole } from '@website/shared-types';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Partial<UserDocument> | null> {
    const user = await this.userService.get(username);
    if (user && (await compare(pass, user.hashedPassword))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(
    user: Partial<UserDocument>,
  ): Promise<{ access_token: string; role: UserRole; id: string }> {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      role: user.role,
      id: user._id.toString(),
    };
  }
}
