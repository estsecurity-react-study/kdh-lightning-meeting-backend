import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { SessionService } from 'src/session/session.service';

import { AuthService } from './auth.service';
import { GetUserId } from './decorators/get-userId.decorator';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { CookieAuthGuard } from './guards/CookieAuthGuard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto);
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthLoginDto) {
    return this.authService.login(dto);
  }

  @ApiCookieAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @UseGuards(CookieAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@GetUserId() userId) {
    return this.authService.me(userId);
  }

  @ApiCookieAuth()
  @UseGuards(CookieAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout() {
    return this.sessionService.destroySession();
  }
}
