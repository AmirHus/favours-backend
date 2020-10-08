import Router from 'koa-router';
import { ValidationError } from 'joi';
import { createPublicRequestValidator } from '../validators/createPublicRequestValidator';
import { IAuth0Token } from '../interfaces/iAuth0Token';
import { createPublicRequest } from '../dbqurries/publicRequestDataAccess';
import { INewPublicRequestReward } from '../interfaces/iNewPublicRequestReward';
import { newPublicRequestRewardsFormatter } from '../utilities/newPublicRequestRewardsFormatter';
import { IPublicRequest } from '../interfaces/iPublicRequest';
import { createPublicRequestReward } from '../dbqurries/publicRequestRewardDataAccess';

export const publicRequestRouter = new Router();

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
