import Joi from 'joi';
import { FavourItems } from '../enums/favourItem';
import { rewardSchema } from './addRewardsValidator';

const types = Object.values(FavourItems);

// schema of request body when creating a new public request
export const createPublicRequestValidator = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string(),
  rewards: Joi.array().min(1).items(rewardSchema).required(),
});
