import Joi from 'joi';

export const createUserValidator = Joi.object({
  id: Joi.number().min(1).max(20).required(),
  email: Joi.string().min(1).max(50).required(),
  name: Joi.string().min(1).max(50).required(),
});
