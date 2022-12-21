import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Request, Response } from 'express';

import { AuthService } from 'src/auth/auth.service';
import { AuthProvidersEnum } from 'src/auth/enums/auth-providers.enum';

import { AuthGoogleService } from './auth-google.service';

@ApiTags('Auth')
@Controller('auth/google')
export class AuthGoogleController {
  constructor(
    private readonly authService: AuthService,
    private readonly authGoogleService: AuthGoogleService,
  ) {}

  @Get('login')
  @HttpCode(HttpStatus.FOUND)
  async authorize(@Res({ passthrough: true }) res: Response) {
    const authUrl = this.authGoogleService.generateAuthUrl();
    return res.redirect(authUrl);
  }

  @Get('callback')
  @HttpCode(HttpStatus.FOUND)
  async callback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const code = req.query.code as string;
    const tokens = await this.authGoogleService.getTokens(code);
    const profile = await this.authGoogleService.getProfileByIdToken(
      tokens.id_token,
    );

    await this.authService.socialLogin(
      {
        socialId: profile.sub,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
      },
      AuthProvidersEnum.google,
    );

    return res.redirect('http://localhost:3000');
  }
}
