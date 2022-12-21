import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as Joi from 'joi';
import { DataSource } from 'typeorm';

import { AuthGoogleModule } from './auth-google/auth-google.module';
import { AuthModule } from './auth/auth.module';
import { UniqueValidator } from './common/validators/unique.validator';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import googleConfig from './config/google.config';
import validationSchema from './config/validationSchema';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { SessionModule } from './session/session.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, googleConfig],
      envFilePath: ['.env'],
      validationSchema,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) =>
        await new DataSource(options).initialize(),
    }),
    SessionModule,
    UsersModule,
    AuthModule,
    AuthGoogleModule,
  ],
  controllers: [],
  providers: [UniqueValidator],
})
export class AppModule {}
