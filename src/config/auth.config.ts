import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  sessionSecret: process.env.AUTH_SESSION_SECRET,
}));
