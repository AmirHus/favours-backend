import Joi from 'joi';
import { FavourItems } from '../enums/favourItem';

const types = Object.values(FavourItems);

export const createPublicRequestValidator = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string(),
  rewards: Joi.array()
    .min(1)
    .items(
      Joi.object({
        rewardItem: Joi.string()
          .min(1)
          .max(15)
          .valid(...types)
          .required(),
        noOfRewards: Joi.number().min(1).required(),
      })
    )
    .required(),
});
