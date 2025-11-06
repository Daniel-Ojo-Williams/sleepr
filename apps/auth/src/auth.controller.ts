import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { Response } from 'express';
import { CreateUserDto } from './users/dto/create-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenPayload } from './interfaces/token.interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, token } = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    response.cookie('Authentication', token, {
      httpOnly: true,
    });

    return { message: 'Login successful', data: user };
  }

  @Post('register')
  async register(@Body() registerDto: CreateUserDto) {
    const res = await this.authService.register(registerDto);
    return { message: 'User registered successfully', data: res };
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  authenticate(@Payload() data: { user: TokenPayload }) {
    return data.user;
  }
}
