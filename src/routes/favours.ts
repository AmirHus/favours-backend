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
  getFavourProof,
  getFavourById,
  completeFavourWithoutProof,
  completeFavourWithProof,
} from '../dbqurries/favourDataAccess';
import { getFile, uploadFile } from '../utilities/awsS3Management';
import { INewFavour } from '../interfaces/iNewFavour';
import { AWS_CONFIG } from '../config';
import { IFavour } from '../interfaces/iFavour';

export const favourRouter = new Router();

// get all favours which this user owes or owed to.
favourRouter.get('/favour', async (ctx) => {
  const userId = (ctx.state as { auth0User: IAuth0Token }).auth0User.sub;

  const favours = {
    owed: await getOwedFavours(userId),
    owing: await getOwingFavours(userId),
  };

  return (ctx.body = { favours });
});

// get the image proof for a particular favour
favourRouter.get('/favour/:id/proof', async (ctx) => {
  const id = (ctx.params as { id: number }).id;
  const userId = (ctx.state as { auth0User: IAuth0Token }).auth0User.sub;

  let favour;
  try {
    favour = (await getFavourProof(id))[0] as {
      created_by: string;
      other_party: string;
      proof: string;
    };
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    return (ctx.body = 'unable to get favour');
  }

  if (favour.created_by !== userId && favour.other_party !== userId) {
    ctx.status = 403;
    return (ctx.body = 'not authorised to access this favour');
  }

  if (!favour.proof) {
    ctx.status = 200;
    return (ctx.body = 'no proof');
  }

  const file = await getFile(favour.proof);
  const data = file.Body.toString('utf-8');
  ctx.set('Content-Type', file.ContentType);
  ctx.status = 200;
  return (ctx.body = { data });
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
    key = `${AWS_CONFIG.FAVOUR_FOLDER_NAME}/${ulid()}`;
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
favourRouter.put('/favour/:id/complete', async (ctx) => {
  const id = (ctx.params as { id: number }).id;
  const userId = (ctx.state as { auth0User: IAuth0Token }).auth0User.sub;

  const favours = await getFavourById(id);

  if (!favours.length) {
    ctx.status = 400;
    return (ctx.body = 'invalid id');
  }

  const favour = favours[0] as IFavour;

  if (favour.created_by !== userId && favour.other_party !== userId) {
    ctx.status = 403;
    return (ctx.body = 'not authorised to edit this favour');
  }

  if (favour.repaid) {
    ctx.status = 400;
    return (ctx.body = 'favour is already complete');
  }

  let key = null;

  if (
    (userId === favour.created_by && favour.owing) ||
    (userId === favour.other_party && !favour.owing)
  ) {
    const files = ctx.request.files;
    if (!files) {
      ctx.status = 400;
      return (ctx.body = 'image proof is required');
    }
    try {
      key = `${AWS_CONFIG.FAVOUR_FOLDER_NAME}/${ulid()}`;
      uploadFile(files.file.path, files.file.type, key);
    } catch (error) {
      console.log(error);
      ctx.status = 400;
      return (ctx.body = 'Could not complete favour');
    }
  }

  try {
    if (key !== null) {
      await completeFavourWithoutProof(id);
    } else {
      await completeFavourWithProof(id, key);
    }
  } catch (error) {
    ctx.status = 500;
    ctx.body = 'could not update favour';
  }

  // save the user contained in the POST body
  ctx.status = 200;
  return (ctx.body = 'favour completed');
});
