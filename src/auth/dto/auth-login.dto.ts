import { PickType } from '@nestjs/swagger';

import { User } from './../../users/entities/user.entity';

export class AuthLoginDto extends PickType(User, [
  'email',
  'password',
] as const) {}
