import Joi from 'joi';

export const tokenRequestValidator = Joi.object({
  code: Joi.string().min(1).required(),
  redirectUri: Joi.string().min(1).required(),
});
