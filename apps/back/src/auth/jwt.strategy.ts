import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { type Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from 'settings';

import { type UserDocument } from 'user/user.schema';
import { UserService } from 'user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(
    _req: Request,
    payload: {
      sub: Types.ObjectId;
      username: string;
    },
  ): Promise<Partial<UserDocument>> {
    const user = await this.userService.get(payload.username);
    return { _id: payload.sub, username: payload.username, role: user.role };
  }
}
