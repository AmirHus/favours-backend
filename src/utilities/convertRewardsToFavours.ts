import { createFavour } from '../dbqurries/favourDataAccess';
import { IPublicRequestReward } from '../interfaces/iPublicRequestReward';

// converts rewards from a public request to favours
export async function convertRewardsToFavour(
  rewards: IPublicRequestReward[],
  userId: string,
  key: string
) {
  const promises = rewards.map(async (reward) => {
    return await createFavour(
      userId,
      reward.user_id,
      reward.reward_item,
      reward.no_of_rewards,
      false,
      key
    );
  });
  await Promise.all(promises);
}
