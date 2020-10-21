import { pool } from './pool';

export async function createPublicRequestReward(
  userIds: string[],
  publicRequestIds: number[],
  rewardItems: string[],
  numberofRewards: number[]
) {
  const publicRequestRewards = await pool.query(
    `
    INSERT INTO public.public_request_reward (public_request_id, user_id, reward_item, no_of_rewards)
    SELECT * from UNNEST
      ($1::int[], $2::text[], $3::text[], $4::int[])
    RETURNING *
    `,
    [publicRequestIds, userIds, rewardItems, numberofRewards]
  );

  return publicRequestRewards.rows;
}

export async function getUserRewards(userId: string, publicRequestId: number) {
  const rewards = await pool.query(
    `
    SELECT * FROM public.public_request_reward
    WHERE user_id = $1 AND public_request_id = $2
    `,
    [userId, publicRequestId]
  );

  return rewards.rows;
}

export async function getPublicRequestRewards(publicRequestId: number) {
  const rewards = await pool.query(
    `
    SELECT U.name, U.email, R.reward_item, R.no_of_rewards 
    FROM public.public_request_reward R INNER JOIN public.user U
    ON U.id = R.user_id
    WHERE public_request_id = $1
    `,
    [publicRequestId]
  );

  return rewards.rows;
}

export async function getPublicRequestRewardsInternal(publicRequestId: number) {
  const rewards = await pool.query(
    `
    SELECT * from public.public_request_reward WHERE public_request_id = $1
    `,
    [publicRequestId]
  );

  return rewards.rows;
}

export async function updateUserRewards(
  userId: string,
  rewardItem: string,
  publicRequestId: number,
  numberofRewards: number
) {
  await pool.query(
    `
    UPDATE public.public_request_reward
    SET no_of_rewards = $1
    WHERE user_id = $2 AND reward_item = $3 AND public_request_id = $4
    `,
    [numberofRewards, userId, rewardItem, publicRequestId]
  );
}
