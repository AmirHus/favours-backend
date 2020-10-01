import Router from 'koa-router';
import { createFavourValidator } from '../validators/createFavourValidator';
import { ValidationError } from 'joi';
import { IFavour } from '../interfaces/iFavour';
import { createFavour } from '../dbqurries/favour_table';

export const favourRouter = new Router();

favourRouter.get('/favour', (ctx) => {
  return (ctx.body = { message: 'this is a favour' });
});

// create a new favour
favourRouter.post('/favour', async (ctx) => {
  const body = ctx.request.body;

  // data validation
  try {
    await createFavourValidator.validateAsync(body, { abortEarly: false });
  } catch (error) {
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
  }

  // Create the favour
  try {
    await createFavour(body.createdBy, body.otherParty, body.favourItem, 1);
  } catch (error) {
    ctx.status = 400;
    if (error.code === '23503') {
      return (ctx.body = 'Please make sure a valid user');
    }
  }
  // save the user contained in the POST body
  ctx.status = 200;
  return (ctx.body = body);
});
