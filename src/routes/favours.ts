import Router from 'koa-router';
import { createFavourValidator } from '../validators/createFavourValidator';
import { array, ValidationError } from 'joi';
import aws from 'aws-sdk';
import fs from 'fs';
import { IAuth0Token } from '../interfaces/iAuth0Token';
import { IFavour } from '../interfaces/iFavour';
import {
  completeFavour,
  createFavour,
  getOwedFavours,
  getOwingFavours,
} from '../dbqurries/favour_table';
import { completeFavourValidator } from '../validators/completeFavourValidator';
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
  const body = ctx.request.body;
  const userId = (ctx.state as { auth0User: IAuth0Token }).auth0User.sub;

  // favour data validation
  try {
    await createFavourValidator.validateAsync(body, { abortEarly: false });
  } catch (error) {
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
  }

  // create the favour
  try {
    await createFavour(
      body.createdBy,
      body.otherParty,
      body.favourItem,
      body.noRewards
    );
  } catch (error) {
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
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
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
  }

  // upload the file to the database
  const userId = (ctx.state as { auth0User: IAuth0Token }).auth0User.sub;

  const uploadFile = async (
    fileName: string,
    filePath: string,
    fileType: string
  ) => {
    return new Promise((resolve, reject) => {
      aws.config.update({
        region: 'ap-southeast-2',
        accessKeyId: AWS_CONFIG.ACCESS_KEY_ID,
        secretAccessKey: AWS_CONFIG.SECRET_KEY,
      });

      const s3 = new aws.S3({
        apiVersion: '2006-03-01',
      });

      const stream = fs.createReadStream(filePath);
      stream.on('error', function (err) {
        reject(err);
      });

      s3.upload(
        {
          // ACL: "public-read",
          Bucket: AWS_CONFIG.BUCKET_ID,
          Body: stream,
          Key: body.id + '/' + fileName,
          ContentType: fileType,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else if (data) {
            resolve({ key: data.Key, url: data.Location });

            completeFavour(body.id);
          }
        }
      );
    });
  };

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
