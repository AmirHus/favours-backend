import Router from 'koa-router';
import { createFavourValidator } from '../validators/createFavourValidator';
import { ValidationError } from 'joi';
import { ulid } from 'ulid';
import { IAuth0Token } from '../interfaces/iAuth0Token';
import {
  // completeFavour,
  createFavour,
  getOwedFavours,
  getOwingFavours,
} from '../dbqurries/favourDataAccess';
import { completeFavourValidator } from '../validators/completeFavourValidator';
import { uploadFile } from '../utilities/awsS3Management';
import { INewFavour } from '../interfaces/iNewFavour';
import { AWS_CONFIG } from '../config';

export const favourRouter = new Router();

// get all favours which this user owes or owed to.
favourRouter.get('/favour', async (ctx) => {
  const userId = (ctx.state as { auth0User: IAuth0Token }).auth0User.sub;

  const favours = {
    owed: await getOwedFavours(userId),
    owing: await getOwingFavours(userId),
  };

  return (ctx.body = { message: favours });
});

// create a new favour in the database for this user.
favourRouter.post('/favour', async (ctx) => {
  const body = ctx.request.body as INewFavour;
  const userId = (ctx.state as { auth0User: IAuth0Token }).auth0User.sub;

  // favour data validation
  try {
    await createFavourValidator.validateAsync(body, { abortEarly: false });
  } catch (error) {
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
  }

  const owing = JSON.parse(body.owing) as boolean;

  let key = null;
  if (!owing) {
    const imageProof = ctx.request.files;
    if (!imageProof.file) {
      ctx.status = 400;
      return (ctx.body = 'image proof is missing');
    }
    key = `${AWS_CONFIG.FOLDER_NAME}/${ulid()}`;
    try {
      await uploadFile(imageProof.file.path, imageProof.file.type, key);
    } catch (error) {
      console.error(error);
      ctx.status = 500;
      return (ctx.body = 'could not save image');
    }
  }

  // create the favour
  try {
    await createFavour(
      userId,
      body.otherParty,
      body.favourItem,
      body.noOfItems,
      owing,
      key
    );
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    return (ctx.body = 'could not create favour');
  }
  // save the user contained in the POST body
  ctx.status = 200;
  return (ctx.body = body);
});

// complete a favour
favourRouter.post('/favour/complete', async (ctx) => {
  const body = ctx.request.body;
  const files = ctx.request.files;

  // data validation
  try {
    await completeFavourValidator.validateAsync(body, { abortEarly: false });
  } catch (error) {
    ctx.status = 500;
    return (ctx.body = (error as ValidationError).message);
  }

  // upload the file to the database
  const userId = (ctx.state as { auth0User: IAuth0Token }).auth0User.sub;

  try {
    uploadFile(files.file.name, files.file.path, files.file.type);
  } catch (error) {
    ctx.status = 400;
    return (ctx.body = 'Could not complete favour');
  }
  // save the user contained in the POST body
  ctx.status = 200;
  return (ctx.body = body);
});
