import * as Joi from 'joi';

export default Joi.object({
  // App
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  APP_PORT: Joi.number().default(8000),

  // Database
  DATABASE_TYPE: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_DATABASE: Joi.string().required(),
  DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
  DATABASE_MAX_CONNECTIONS: Joi.number().default(10),

  // Auth
  AUTH_SESSION_SECRET: Joi.string().required(),

  // Google OAuth
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
});
