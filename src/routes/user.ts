import Router from 'koa-router';
import { createUserValidator } from '../validators/createUserValidator';
import { ValidationError } from 'joi';
import { IUser} from '../interfaces/iUser';

export const userRouter = new Router();

userRouter.post('/user', (ctx) => {
  return (ctx.body = { message: 'this is post' });
});

userRouter.get('/user/:id', (ctx) => {
  return (ctx.body = { message: 'this is get' });
});
