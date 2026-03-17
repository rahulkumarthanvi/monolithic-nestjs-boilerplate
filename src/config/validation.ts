import * as Joi from 'joi';

export function validateEnv(config: Record<string, unknown>) {
  const schema = Joi.object({
    PORT: Joi.string().default('3000'),
    MONGO_URI: Joi.string().required(),
    JWT_ACCESS_SECRET: Joi.string().min(16).required(),
    JWT_REFRESH_SECRET: Joi.string().min(16).required(),
    ACCESS_TOKEN_EXPIRY: Joi.string().default('15m'),
    REFRESH_TOKEN_EXPIRY: Joi.string().default('7d'),
    NODE_ENV: Joi.string()
      .valid('development', 'staging', 'production', 'test')
      .default('development'),
  });

  const { error, value } = schema.validate(config, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
  });

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }

  return value;
}

