import * as joi from 'joi';

export const ValidationSchema = joi.object({
  port: joi.number().required(),
  postgres_host: joi.string().required(),
  postgres_port: joi.number().required(),
  postgres_user: joi.string().required(),
  postgres_password: joi.string().required(),
  postgres_database: joi.string().required(),
});
