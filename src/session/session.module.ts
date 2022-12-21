import {
  DynamicModule,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';

import { TypeormStore } from 'connect-typeorm';
import * as ExpressSession from 'express-session';
import { Repository } from 'typeorm';

import { DAYS_BY_MS } from 'src/common/constants/datetime.constants';

import { Session } from './entities/Session.entity';
import { SessionService } from './session.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule implements NestModule {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        ExpressSession({
          resave: false,
          saveUninitialized: false,
          store: new TypeormStore({
            cleanupLimit: 2,
            limitSubquery: false,
            ttl: Math.trunc(DAYS_BY_MS / 1000),
          }).connect(this.sessionRepository),
          secret: this.configService.get('auth.sessionSecret'),
          cookie: { httpOnly: true, maxAge: DAYS_BY_MS },
        }),
      )
      .forRoutes('*');
  }

  static forRoot(): DynamicModule {
    return {
      module: SessionModule,
      providers: [SessionService],
      exports: [SessionService],
    };
  }
}
