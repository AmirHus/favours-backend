import Joi from 'joi';
import { FavourItems } from '../enums/favourItem';

const types = Object.values(FavourItems);

export const createFavourValidator = Joi.object({
  otherParty: Joi.string().min(1).max(30).required(),
  noOfItems: Joi.number().min(1).required(),
  owing: Joi.boolean().required(),
  favourItem: Joi.string()
    .valid(...types)
    .min(1)
    .max(15)
    .required(),
});
