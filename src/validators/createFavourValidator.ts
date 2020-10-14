import Joi from 'joi';
import { FavourItems } from '../enums/favourItem';

const types = Object.values(FavourItems);

export const createFavourValidator = Joi.object({
  createdBy: Joi.string().min(1).max(255).required(),
  otherParty: Joi.string().min(1).max(255).required(),
  noRewards: Joi.number().min(1).required(),
  favourItem: Joi.string()
    .valid(...types)
    .min(1)
    .max(15)
    .required(),
});
