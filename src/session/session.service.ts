import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import e, { Request } from 'express';

import { SessionInterface } from './interfaces/session.interface';

@Injectable({ scope: Scope.REQUEST })
export class SessionService {
  constructor(
    @Inject(REQUEST)
    private request: Request,
  ) {}

  getSession(key: keyof SessionInterface) {
    return this.request.session[key] ?? null;
  }

  setSession(key: keyof SessionInterface, value: any) {
    this.request.session[key] = value;
  }

  destroySession() {
    return new Promise((resolve, reject) => {
      this.request.session.destroy((error) => {
        if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      });
    });
  }
}
