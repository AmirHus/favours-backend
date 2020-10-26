import Joi from 'joi';

// schema of request body when creating a new user
export const createUserValidator = Joi.object({
  name: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().min(1).max(50).required(),
  password: Joi.string().min(8).required(),
});
