import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@website/shared-types';
import { compare } from 'bcrypt';
import { UserDocument } from 'user/user.schema';
import { UserService } from 'user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<UserDocument> | null> {
    const user = await this.userService.get(username);
    if (user && (await compare(password, user.hashedPassword))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(
    user: Partial<UserDocument>,
  ): Promise<{ access_token: string; role: UserRole }> {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      role: user.role,
    };
  }
}
