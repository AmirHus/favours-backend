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

// validator with request body when adding rewards
export const addRewardsValidator = Joi.object({
  rewards: Joi.array().required().min(1).items(rewardSchema),
});
