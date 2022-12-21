import { PickType } from '@nestjs/swagger';

import { Validate } from 'class-validator';

import { InheritParentDecorators } from 'src/common/decorators/InheritParentDecorators';
import { UniqueValidator } from 'src/common/validators/unique.validator';
import { User } from 'src/users/entities/user.entity';

export class AuthRegisterDto extends PickType(User, [
  'email',
  'name',
  'password',
] as const) {
  @InheritParentDecorators()
  @Validate(UniqueValidator, ['User'], {
    message: '이메일이 이미 존재합니다',
  })
  email: User['email'];
}
