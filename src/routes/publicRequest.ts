import Router from 'koa-router';
import { ValidationError } from 'joi';
import { createPublicRequestValidator } from '../validators/createPublicRequestValidator';
import { IAuth0Token } from '../interfaces/iAuth0Token';
import { createPublicRequest } from '../dbqurries/publicRequestDataAccess';

export const publicRequestRouter = new Router();

publicRequestRouter.post('/publicRequest', async (ctx) => {
  const body = ctx.request.body as { title: string; description?: string };

  try {
    createPublicRequestValidator.validateAsync(body, { abortEarly: false });
  } catch (error) {
    console.log(error);
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
  }

  const publicRequest = {
    createdBy: (ctx.state as { auth0User: IAuth0Token }).auth0User.sub,
    title: body.title,
    description: body.description || '',
    completed: false,
  };

  try {
    const newPublicRequest = await createPublicRequest(publicRequest);
    ctx.status = 200;
    return (ctx.body = newPublicRequest);
  } catch (error) {
    console.error(error);
    ctx.throw(500, 'unable to create publicRequest');
  }
});
