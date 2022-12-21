import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OAuth2Client } from 'google-auth-library';

import { SessionService } from '../session/session.service';

@Injectable()
export class AuthGoogleService {
  private google: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    this.google = new OAuth2Client(
      configService.get('google.clientId'),
      configService.get('google.clientSecret'),
    );
  }

  generateAuthUrl() {
    return this.google.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      // redirect_uri: 'http://localhost:3000/auth/google/callback',
      redirect_uri: 'http://localhost:8000/api/auth/google/callback',
    });
  }

  getTokens(code: string) {
    return this.google
      .getToken({
        code: code,
        redirect_uri: 'http://localhost:8000/api/auth/google/callback',
      })
      .then((data) => data.tokens);
  }

  getProfileByIdToken(idToken: string) {
    return this.google
      .verifyIdToken({
        idToken,
        audience: [this.configService.get('google.clientId')],
      })
      .then((ticket) => ticket.getPayload());
  }
}
