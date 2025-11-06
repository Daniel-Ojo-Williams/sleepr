import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interfaces/token.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request & { Authentication: string }) =>
          (request?.cookies?.Authentication as string) ||
          request?.Authentication,
      ]),
      secretOrKey: config.get<string>('JWT_SECRET')!,
    });
  }

  async validate({ id }: TokenPayload) {
    const user = await this.usersService.findUser({ id });

    if (!user) throw new UnauthorizedException('Account not found');

    return user;
  }
}
