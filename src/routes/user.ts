import Router from 'koa-router';
import { createUserValidator } from '../validators/createUserValidator';
import { INewUser } from '../interfaces/iNewUser';
import { getAuth0User, createAuth0User } from '../utilities/auth0ManagamentApi';
import { ValidationError } from 'joi';
import { createUser } from '../dbqurries/userDataAccess';

export const userRouter = new Router();

userRouter.post('/user', async (ctx) => {
  const newUser = ctx.request.body as INewUser;

  try {
    await createUserValidator.validateAsync(newUser, { abortEarly: false });
  } catch (error) {
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
  }

  try {
    // check if user exists first
    const users = await getAuth0User(newUser.email);
    if (users.length) {
      ctx.status = 400;
      return (ctx.body = `user with email ${newUser.email} already exists`);
    }
    // create the user in auth0
    const auth0User = await createAuth0User(newUser);
    // create the user in the database
    const user = await createUser({
      id: auth0User.user_id,
      email: newUser.email,
      name: newUser.name,
    });

    ctx.status = 200;
    ctx.body = { message: 'user successfuly created', user };
  } catch (error) {
    console.log(error);
    ctx.status = 500;
    return (ctx.body = 'internal server error');
  }
});

userRouter.get('/user/:id', (ctx) => {
  return (ctx.body = { message: 'this is get' });
});
