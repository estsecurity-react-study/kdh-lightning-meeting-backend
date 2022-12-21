import {
  Injectable,
  UnprocessableEntityException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { validateOrReject } from 'class-validator';

import { SessionService } from 'src/session/session.service';
import { SocialInterface } from 'src/social/interfaces/social.interface';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthProvidersEnum } from './enums/auth-providers.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
  ) {}

  register(dto: AuthRegisterDto) {
    return this.usersService.create(dto);
  }

  async login(dto: AuthLoginDto) {
    const user = await this.usersService.findOne({
      email: dto.email,
    });

    const compare = await user.checkPassword(dto.password);
    if (!compare) {
      throw new UnprocessableEntityException({
        errors: {
          password: '잘못된 패스워드입니다',
        },
      });
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new UnprocessableEntityException({
        errors: {
          email: '소셜 로그인으로 로그인해야합니다',
        },
      });
    }

    this.sessionService.setSession('userId', user.id);

    return {
      user,
    };
  }

  async socialLogin(
    socialData: SocialInterface,
    authProvider: keyof typeof AuthProvidersEnum,
  ) {
    if (authProvider === AuthProvidersEnum.email) {
      throw new InternalServerErrorException();
    }
    let user: User;

    const socialEmail = socialData.email?.toLowerCase();

    const userByEmail = await this.usersService.findOne({
      email: socialEmail,
    });

    user = await this.usersService.findOne({
      socialId: socialData.socialId,
      provider: authProvider,
    });

    if (user) {
      if (socialEmail && !userByEmail) {
        user.email = socialEmail;
      }
      await this.usersService.update(user.id, user);
    } else if (userByEmail) {
      userByEmail.socialId = socialData.socialId;
      userByEmail.provider = authProvider;
      await this.usersService.update(user.id, userByEmail);
    } else {
      user = await this.usersService.create({
        email: socialEmail,
        name: socialData.name,
        password: null,
        socialId: socialData.socialId,
        provider: authProvider,
      });
    }

    this.sessionService.setSession('userId', user.id);

    return {
      user,
    };
  }

  async me(userId: User['id']) {
    const user = await this.usersService.findOne({
      id: userId,
    });

    if (user) return user;

    throw new NotFoundException();
  }
}
