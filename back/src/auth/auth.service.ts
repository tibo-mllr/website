import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findOne(username);
    if (user && (await compare(pass, user.hashedPassword))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Partial<User>): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
    };
  }
}
