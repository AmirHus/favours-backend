import Router from 'koa-router';

export const userRouter = new Router();

userRouter.post('/user', (ctx) => {
  return (ctx.body = { message: 'this is post' });
});

userRouter.get('/user/:id', (ctx) => {
  return (ctx.body = { message: 'this is get' });
});
