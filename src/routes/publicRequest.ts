import Router from 'koa-router';
import { ulid } from 'ulid';
import { ValidationError } from 'joi';
import { createPublicRequestValidator } from '../validators/createPublicRequestValidator';
import { IAuth0Token } from '../interfaces/iAuth0Token';
import {
  acceptPublicRequest,
  completePublicRequest,
  createPublicRequest,
  getAvailablePublicRequests,
  getPublicRequestById,
  getLeaderboard,
} from '../dbqurries/publicRequestDataAccess';
import { INewPublicRequestReward } from '../interfaces/iNewPublicRequestReward';
import { newPublicRequestRewardsFormatter } from '../utilities/newPublicRequestRewardsFormatter';
import { IPublicRequest } from '../interfaces/iPublicRequest';
import {
  createPublicRequestReward,
  getUserRewards,
  updateUserRewards,
  getPublicRequestRewards,
  getPublicRequestRewardsInternal,
} from '../dbqurries/publicRequestRewardDataAccess';
import { addRewardsValidator } from '../validators/addRewardsValidator';
import { IPublicRequestReward } from '../interfaces/iPublicRequestReward';
import { updateUserRewardsFormatter } from '../utilities/updateUserRewardsFormatter';
import { AWS_CONFIG } from '../config';
import { uploadFile } from '../utilities/awsS3Management';
import { convertRewardsToFavour } from '../utilities/convertRewardsToFavours';

export const publicRequestRouter = new Router();

// get the leaderboard of users
publicRequestRouter.get('/publicRequest/leaderboard', async (ctx) => {
  try {
    const leaderboard = await getLeaderboard();
    ctx.status = 200;
    return (ctx.body = leaderboard);
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    return (ctx.body = 'could not retrieve the leaderboard');
  }
});

// returns the list of public request that are available to accept
publicRequestRouter.get('/publicRequest/available', async (ctx) => {
  const publicRequests = await getAvailablePublicRequests();
  ctx.status = 200;
  return (ctx.body = publicRequests);
});

// returns the rewards for a particular public request
publicRequestRouter.get('/publicRequest/:id/reward', async (ctx) => {
  const publicRequestId = (ctx.params as { id: number }).id;

  const rewards = await getPublicRequestRewards(publicRequestId);
  ctx.status = 200;
  return (ctx.body = rewards);
});

// create a public request
publicRequestRouter.post('/publicRequest', async (ctx) => {
  const body = ctx.request.body as {
    title: string;
    description?: string;
    rewards: INewPublicRequestReward[];
  };

  // validate the request
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

  // setting up the request
  const newPublicRequest = {
    createdBy: userId,
    title: body.title,
    description: body.description || '',
    completed: false,
  };

  try {
    // create the request in the database
    const publicRequest = (await createPublicRequest(
      newPublicRequest
    )) as IPublicRequest;

    // format the rewards so they can be added to the database
    const formattedPublicRequestRewards = newPublicRequestRewardsFormatter(
      publicRequest.id,
      userId,
      body.rewards
    );

    // create the rewards in the database
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
    ctx.status = 500;
    return (ctx.body = 'unable to create publicRequest');
  }
});

// add rewards to a particular public request
publicRequestRouter.put('/publicRequest/:id/reward', async (ctx) => {
  const body = ctx.request.body as { rewards: INewPublicRequestReward[] };
  const publicRequestId = (ctx.params as { id: number }).id;

  // validate the request
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

  let request;
  try {
    // read the public request and check if the id is valid and it's not accepted or completed
    request = await getPublicRequestById(publicRequestId);
    if (request.length === 0) {
      ctx.status = 400;
      return (ctx.body = 'invalid public request id');
    }
    request = request[0] as IPublicRequest;
    if (request.completed) {
      ctx.status = 400;
      return (ctx.body = 'request is already completed');
    }
    if (request.accepted_by) {
      ctx.status = 400;
      return (ctx.body = 'request is already accepted');
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    return (ctx.body = 'could not retreive public request');
  }

  try {
    // get the current rewards the calling user is offering
    const currentRewards = (await getUserRewards(
      userId,
      publicRequestId
    )) as IPublicRequestReward[];

    // seperate rewards that need to be created and ones to be updated
    const sortedRewards = updateUserRewardsFormatter(
      currentRewards,
      body.rewards
    );

    // if some rewards are new, create new rewards
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

    // update the rewards that exist already
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

    ctx.status = 200;
    return (ctx.body = { message: 'rewards updated' });
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    return (ctx.body = { message: 'could not update the rewards' });
  }
});

// allows user to accept a public request
publicRequestRouter.put('/publicRequest/:id/accept', async (ctx) => {
  const publicRequestId = (ctx.params as { id: number }).id;
  const userId = (ctx.state as { auth0User: IAuth0Token }).auth0User.sub;

  let request;
  try {
    // check to see if id provided is valid
    request = await getPublicRequestById(publicRequestId);
    if (request.length === 0) {
      ctx.status = 400;
      return (ctx.body = 'invalid public request id');
    }
    // stop user form accepting their own request
    request = request[0] as IPublicRequest;
    if (request.created_by === userId) {
      ctx.status = 400;
      return (ctx.body = 'cannot accept a public request created by you');
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    return (ctx.body = 'could not retreive public request');
  }

  // accpet the request
  try {
    await acceptPublicRequest(publicRequestId, userId);
    ctx.status = 200;
    return (ctx.body = 'publict request accepted');
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    return (ctx.body = 'could not accept public request');
  }
});

// complete a request that is already accpeted
publicRequestRouter.put('/publicRequest/:id/complete', async (ctx) => {
  const publicRequestId = (ctx.params as { id: number }).id;
  const userId = (ctx.state as { auth0User: IAuth0Token }).auth0User.sub;

  try {
    let request;
    // check the id is valid
    request = await getPublicRequestById(publicRequestId);
    if (request.length === 0) {
      ctx.status = 400;
      return (ctx.body = 'invalid public request id');
    }
    // stop users from completing requests they did not accept
    request = request[0] as IPublicRequest;
    if (request.accepted_by !== userId) {
      ctx.status = 403;
      return (ctx.body = 'cannot complete a request you did not accept');
    }
    // stop users from completing request that is already complete
    if (request.completed) {
      ctx.status = 400;
      return (ctx.body = 'public request is already compelte');
    }
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    return (ctx.body = 'could not retrieve public request');
  }

  // check to see if proof is required, and store the image in s3 bucket
  let key;
  try {
    const files = ctx.request.files;
    if (!files) {
      ctx.status = 400;
      return (ctx.body = 'image proof is required');
    }
    key = `${AWS_CONFIG.PUBLIC_REQUEST_FOLDER_NAME}/${ulid()}`;
    uploadFile(files.file.path, files.file.type, key);
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    return (ctx.body = 'could not upload image');
  }

  // record the public request as complete
  try {
    await completePublicRequest(publicRequestId, key);
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    return (ctx.body = 'Could not complete public request');
  }

  // convert the rewards of the public request to favours
  try {
    const rewards = (await getPublicRequestRewardsInternal(
      publicRequestId
    )) as IPublicRequestReward[];
    await convertRewardsToFavour(rewards, userId, key);
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    return (ctx.body = 'could not convert rewards to favours');
  }

  ctx.status = 200;
  return (ctx.body = 'public request complete');
});
