import Joi from 'joi';

export const createUserValidator = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  email: Joi.string().min(1).max(50).required(),
  password: Joi.string().min(8).required(),
});
