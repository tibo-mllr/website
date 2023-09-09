import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDocument } from 'src/user/user.schema';
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
    sub: Types.ObjectId;
    username: string;
  }): Promise<Partial<UserDocument>> {
    const user = await this.userService.get(payload.username);
    return { _id: payload.sub, username: payload.username, role: user.role };
  }
}
