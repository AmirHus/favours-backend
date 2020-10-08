import { IPublicRequestReward } from '../interfaces/iPublicRequestReward';
import { INewPublicRequestReward } from '../interfaces/iNewPublicRequestReward';
import { uniqueRewardsReducer } from './uniqueRewardsReducer';

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
        publicRequestId: existingReward.publicRequestId,
        reward_item: existingReward.reward_item,
        userId: existingReward.userId,
      });
      return;
    }
    rewardsToCreate.push(newReward);
  });

  return { rewardsToCreate, rewardsToUpdate };
}
