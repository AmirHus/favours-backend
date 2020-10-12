import Joi from 'joi';
//import { FavourItems } from '../enums/favourItem';

//const types = Object.values(FavourItems);

export const completeFavourValidator = Joi.object({
  id: Joi.number().required(),
  // file: Joi.any().required(),
});
