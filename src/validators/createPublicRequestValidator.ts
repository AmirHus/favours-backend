import Joi from 'joi';

export const createPublicRequestValidator = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string(),
});
