import Router from 'koa-router';
import { createUserValidator } from '../validators/createUserValidator';
import { ValidationError } from 'joi';
import { IUser} from '../interfaces/iUser';
import { readUsers } from '../dbqurries/user_table';

export const userRouter = new Router();

userRouter.post('/user', (ctx) => {
  return (ctx.body = { message: 'this is post' });
});

userRouter.get('/user/:id', async (ctx) => {
  const users = await readUsers();
  return (ctx.body = { message: await readUsers() });
});
