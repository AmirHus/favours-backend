import Router from 'koa-router';
import { ValidationError } from 'joi';
import { createPublicRequestValidator } from '../validators/createPublicRequestValidator';
import { IAuth0Token } from '../interfaces/iAuth0Token';
import {
  acceptPublicRequest,
  createPublicRequest,
  getAvailablePublicRequests,
  getPublicRequestById,
  leaderboardRequest,
} from '../dbqurries/publicRequestDataAccess';
import { INewPublicRequestReward } from '../interfaces/iNewPublicRequestReward';
import { newPublicRequestRewardsFormatter } from '../utilities/newPublicRequestRewardsFormatter';
import { IPublicRequest } from '../interfaces/iPublicRequest';
import {
  createPublicRequestReward,
  getUserRewards,
  updateUserRewards,
  getPublicRequestRewards,
} from '../dbqurries/publicRequestRewardDataAccess';
import { addRewardsValidator } from '../validators/addRewardsValidator';
import { IPublicRequestReward } from '../interfaces/iPublicRequestReward';
import { updateUserRewardsFormatter } from '../utilities/updateUserRewardsFormatter';

export const publicRequestRouter = new Router();

publicRequestRouter.get('/publicRequest/leaderboard', async (ctx) => {
  try {
    const leaderboard = await leaderboardRequest();
    ctx.status = 200;
    return (ctx.body = leaderboard);
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    return (ctx.body = 'could not retrieve the leaderboard');
  }
});

publicRequestRouter.get('/publicRequest/available', async (ctx) => {
  const publicRequests = await getAvailablePublicRequests();
  ctx.status = 200;
  return (ctx.body = publicRequests);
});

publicRequestRouter.get('/publicRequest/:id/reward', async (ctx) => {
  const publicRequestId = (ctx.params as { id: number }).id;

  const rewards = await getPublicRequestRewards(publicRequestId);
  ctx.status = 200;
  return (ctx.body = rewards);
});

publicRequestRouter.post('/publicRequest', async (ctx) => {
  const body = ctx.request.body as {
    title: string;
    description?: string;
    rewards: INewPublicRequestReward[];
  };

  try {
    await createPublicRequestValidator.validateAsync(body, {
      abortEarly: false,
    });
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
  }

  const userId = (ctx.state as { auth0User: IAuth0Token }).auth0User.sub;

  const newPublicRequest = {
    createdBy: userId,
    title: body.title,
    description: body.description || '',
    completed: false,
  };

  try {
    const publicRequest = (await createPublicRequest(
      newPublicRequest
    )) as IPublicRequest;

    const formattedPublicRequestRewards = newPublicRequestRewardsFormatter(
      publicRequest.id,
      userId,
      body.rewards
    );

    const publicRequestRewards = await createPublicRequestReward(
      formattedPublicRequestRewards.userIds,
      formattedPublicRequestRewards.publicRequestIds,
      formattedPublicRequestRewards.rewardItems,
      formattedPublicRequestRewards.numberofRewards
    );

    ctx.status = 200;
    return (ctx.body = { publicRequest, publicRequestRewards });
  } catch (error) {
    console.error(error);
    ctx.throw(500, 'unable to create publicRequest');
  }
});

publicRequestRouter.put('/publicRequest/:id/reward', async (ctx) => {
  const body = ctx.request.body as { rewards: INewPublicRequestReward[] };
  const publicRequestId = (ctx.params as { id: number }).id;

  try {
    await addRewardsValidator.validateAsync(body, {
      abortEarly: false,
    });
    if (!publicRequestId) throw new Error('id param missing');
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
  }

  const userId = (ctx.state as { auth0User: IAuth0Token }).auth0User.sub;

  try {
    const currentRewards = (await getUserRewards(
      userId,
      publicRequestId
    )) as IPublicRequestReward[];

    if (currentRewards.length) {
      const sortedRewards = updateUserRewardsFormatter(
        currentRewards,
        body.rewards
      );

      if (sortedRewards.rewardsToCreate.length) {
        const formattedPublicRequestRewards = newPublicRequestRewardsFormatter(
          publicRequestId,
          userId,
          sortedRewards.rewardsToCreate
        );
        await createPublicRequestReward(
          formattedPublicRequestRewards.userIds,
          formattedPublicRequestRewards.publicRequestIds,
          formattedPublicRequestRewards.rewardItems,
          formattedPublicRequestRewards.numberofRewards
        );
      }

      if (sortedRewards.rewardsToUpdate.length) {
        const promises = sortedRewards.rewardsToUpdate.map(async (reward) => {
          await updateUserRewards(
            userId,
            reward.reward_item,
            publicRequestId,
            reward.no_of_rewards
          );
        });
        await Promise.all(promises);
      }
    } else {
      console.log('something');
    }

    ctx.status = 200;
    return (ctx.body = { message: 'rewards updated' });
  } catch (error) {
    console.error(error);

    ctx.status = 500;
    return (ctx.body = { message: 'could not update the rewards' });
  }
});

publicRequestRouter.put('/publicRequest/:id/accept', async (ctx) => {
  const publicRequestId = (ctx.params as { id: number }).id;
  const userId = (ctx.state as { auth0User: IAuth0Token }).auth0User.sub;

  let request;
  try {
    request = await getPublicRequestById(publicRequestId);
    if (request.length === 0) {
      ctx.status = 400;
      return (ctx.body = 'invalid public request id');
    }
    request = request[0] as IPublicRequest;
    if (request.created_by === userId) {
      ctx.status = 400;
      return (ctx.body = 'cannot accept a public request created by you');
    }
  } catch (error) {
    ctx.status = 500;
    return (ctx.body = 'could not retreive public request');
  }

  try {
    await acceptPublicRequest(publicRequestId, userId);
    ctx.status = 200;
    return (ctx.body = 'publict request accepted');
  } catch {
    ctx.status = 500;
    return (ctx.body = 'could not accept public request');
  }
});
