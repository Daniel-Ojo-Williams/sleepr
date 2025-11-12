import { Controller, UseGuards, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/auth-user.decorator';
import { UserDocument } from './models/user.model';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserDto, UserNotFoundError } from '@app/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: UserDocument) {
    return {
      message: 'Welcome chipmunk',
      data: user,
    };
  }

  @MessagePattern('find_user')
  async getUser(@Payload() payload: { id: string }): Promise<UserDto> {
    const user = await this.usersService.findUser({ id: payload.id });

    if (!user) throw new UserNotFoundError();

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }
}
