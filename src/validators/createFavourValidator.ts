import Joi from 'joi';
import { FavourItems } from '../enums/favourItem';

const types = Object.values(FavourItems);

export const createFavourValidator = Joi.object({
  owing: Joi.boolean().required(),
  name: Joi.string().min(1).max(30).required(),
  owingItem: Joi.string()
    .valid(...types)
    .required(),
});
