import Router from 'koa-router';
import { createUserValidator } from '../validators/createUserValidator';
import { ValidationError } from 'joi';
import { IUser } from '../interfaces/iUser';
import { readUsers } from '../dbqurries/user_table';
import { createUser } from '../dbqurries/user_table';

export const userRouter = new Router();

userRouter.get('/user', async (ctx) => {
  return readUsers();
});

/*
userRouter.get('/user/:id', async (ctx) => {
  const body = ctx.request.body;

  try {
    await readUsers();
  } catch (error) {
    ctx.status = 400;
  }
  return (ctx.body = { message: await readUsers() });
});
*/

// create a new user
userRouter.post('/user', async (ctx) => {
  const body = ctx.request.body;

  try {
    await createUserValidator.validateAsync(body, { abortEarly: false });
  } catch (error) {
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
  }

  try {
    await createUser(body.email, body.name);
  } catch (error) {
    ctx.status = 400;
    if (error.code === '23503') {
      return (ctx.body = 'Please make sure a valid user');
    }
  }

  ctx.status = 200;
  return (ctx.body = body);
});
