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
