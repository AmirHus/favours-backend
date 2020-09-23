import Router from 'koa-router';
import { createFavourValidator } from '../validators/createFavourValidator';
import { ValidationError } from 'joi';
import { IFavour } from '../interfaces/iFavour';

export const favourRouter = new Router();

favourRouter.get('/favour', (ctx) => {
  return (ctx.body = { message: 'this is a favour' });
});

// create a new favour
favourRouter.post('/favour', async (ctx) => {
  const body = ctx.request.body;

  try {
    await createFavourValidator.validateAsync(body, { abortEarly: false });
  } catch (error) {
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
  }

  // create a new instance

  // save the user contained in the POST body
  ctx.status = 200;
  return (ctx.body = body);
});
