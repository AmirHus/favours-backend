import Joi from 'joi';
import { FavourItems } from '../enums/favourItem';

const types = Object.values(FavourItems);

export const rewardSchema = Joi.object({
  rewardItem: Joi.string()
    .min(1)
    .max(15)
    .valid(...types)
    .required(),
  noOfRewards: Joi.number().min(1).required(),
});

export const addRewardsValidator = Joi.object({
  rewards: Joi.array().required().items(rewardSchema),
});
