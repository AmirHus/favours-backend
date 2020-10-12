import { INewPublicRequestReward } from '../interfaces/iNewPublicRequestReward';

export function uniqueRewardsReducer(rewards: INewPublicRequestReward[]) {
  const uniqueRewards = [] as INewPublicRequestReward[];

  rewards.forEach((reward) => {
    const existingRewardIndex = uniqueRewards.findIndex(
      (uniqueReward) => reward.rewardItem === uniqueReward.rewardItem
    );
    if (existingRewardIndex === -1) {
      uniqueRewards.push(reward);
      return;
    }
    uniqueRewards[existingRewardIndex].noOfRewards += reward.noOfRewards;
  });

  return uniqueRewards;
}
