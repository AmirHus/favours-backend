// Created a file upload Validator where we can check the contents of the upload.
import Joi from 'joi';

export const uploadFileValidator = Joi.object({
  fields: Joi.number().min(1).max(10).required(),
  files: Joi.number().min(0).max(1),
});
