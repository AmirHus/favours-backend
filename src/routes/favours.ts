import Router from 'koa-router';
import { createFavourValidator } from '../validators/createFavourValidator';
import { ValidationError } from 'joi';

export const favourRouter = new Router();

favourRouter.get('/favour', (ctx) => {
  return (ctx.body = { message: 'this is a favour' });
});

favourRouter.post('/favour', async (ctx) => {
  const body = ctx.request.body;

  try {
    await createFavourValidator.validateAsync(body, { abortEarly: false });
  } catch (error) {
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
  }

  ctx.status = 200;
  return (ctx.body = body);
});
