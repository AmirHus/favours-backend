import Joi from 'joi';
import { FavourItems } from '../enums/favourItem';

const types = Object.values(FavourItems);

export const createFavourValidator = Joi.object({
  id: Joi.number().required(),
  createdBy: Joi.string().min(1).max(20).required(),
  otherParty: Joi.string().min(1).max(20).required(),
  repaid: Joi.boolean().required(),
  name: Joi.string().min(1).max(30).required(),
  owingItem: Joi.string()
    .valid(...types)
    .min(1)
    .max(15)
    .required(),
});
