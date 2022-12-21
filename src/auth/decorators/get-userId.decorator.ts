import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';

export const GetUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    const userId = req.session.userId;
    return userId ?? null;
  },
);
