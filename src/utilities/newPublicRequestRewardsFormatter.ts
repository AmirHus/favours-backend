import { INewPublicRequestReward } from '../interfaces/iNewPublicRequestReward';
import { uniqueRewardsReducer } from './uniqueRewardsReducer';

export function newPublicRequestRewardsFormatter(
  publicRequestId: number,
  userId: string,
  rewards: INewPublicRequestReward[]
) {
  const userIds = [] as string[];
  const publicRequestIds = [] as number[];
  const rewardItems = [] as string[];
  const numberofRewards = [] as number[];

  const uniqueRewards = uniqueRewardsReducer(rewards);

  uniqueRewards.forEach((reward) => {
    userIds.push(userId);
    publicRequestIds.push(publicRequestId);
    rewardItems.push(reward.rewardItem);
    numberofRewards.push(reward.noOfRewards);
  });
  return { userIds, publicRequestIds, rewardItems, numberofRewards };
}
