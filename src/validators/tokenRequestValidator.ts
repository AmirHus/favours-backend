import Joi from 'joi';

// schema of request body when requesting a token
export const tokenRequestValidator = Joi.object({
  code: Joi.string().min(1).required(),
  redirectUri: Joi.string().min(1).required(),
});
