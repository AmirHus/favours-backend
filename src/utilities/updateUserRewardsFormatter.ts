import { IPublicRequestReward } from '../interfaces/iPublicRequestReward';
import { INewPublicRequestReward } from '../interfaces/iNewPublicRequestReward';
import { uniqueRewardsReducer } from './uniqueRewardsReducer';

// splits public request rewards to an array of awards that a new and need to be created
// and rewards that exist and need to be updated
export function updateUserRewardsFormatter(
  currentRewards: IPublicRequestReward[],
  newRewards: INewPublicRequestReward[]
) {
  const rewardsToCreate = [] as INewPublicRequestReward[];
  const rewardsToUpdate = [] as IPublicRequestReward[];

  const uniqueRewards = uniqueRewardsReducer(newRewards);

  uniqueRewards.forEach((newReward) => {
    const existingReward = currentRewards.find(
      (currentReward) => currentReward.reward_item === newReward.rewardItem
    );
    if (existingReward) {
      rewardsToUpdate.push({
        no_of_rewards: newReward.noOfRewards + existingReward.no_of_rewards,
        public_request_id: existingReward.public_request_id,
        reward_item: existingReward.reward_item,
        user_id: existingReward.user_id,
      });
      return;
    }
    rewardsToCreate.push(newReward);
  });

  return { rewardsToCreate, rewardsToUpdate };
}
