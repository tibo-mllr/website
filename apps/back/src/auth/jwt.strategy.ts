import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@website/shared-types';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: {
    sub: number;
    username: string;
  }): Promise<{ _id: number; username: string; role: UserRole }> {
    const user = await this.userService.get(payload.username);
    return { _id: payload.sub, username: payload.username, role: user.role };
  }
}
