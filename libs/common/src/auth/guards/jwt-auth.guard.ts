import { AUTH_SECVICE } from '@app/common/constants';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { map, tap } from 'rxjs';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class CommonJwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SECVICE) private readonly client: ClientProxy) {}

  canActivate(ctx: ExecutionContext) {
    const token = ctx.switchToHttp().getRequest<Request>().cookies
      ?.Authentication as string;

    if (!token) return false;

    return this.client
      .send('authenticate', { Authentication: token })
      .pipe<UserDto, boolean>(
        tap((res: UserDto) => {
          ctx.switchToHttp().getRequest<Request>().user = res;
        }),
        map(() => true),
      );
  }
}
