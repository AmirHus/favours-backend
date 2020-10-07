import Router from 'koa-router';
import { tokenRequestValidator } from '../validators/tokenRequestValidator';
import { IAuth0TokenRequest } from '../interfaces/iAuth0TokenRequest';
import * as jwt from 'jsonwebtoken';
import { AUTH0 } from '../config';
import { ValidationError } from 'joi';
import axios from 'axios';
import { IAuth0Token } from '../interfaces/iAuth0Token';

export const authRouter = new Router();

authRouter.post('/auth/token', async (ctx) => {
  const body = ctx.request.body as IAuth0TokenRequest;

  try {
    await tokenRequestValidator.validateAsync(body, { abortEarly: false });
  } catch (error) {
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
  }

  let token;
  try {
    token = await axios.post(`${AUTH0.BASE_ENDPOINT_URL}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: AUTH0.CLIENT_ID,
      client_secret: AUTH0.CLIENT_SECRET,
      code: body.code,
      redirect_uri: body.redirectUri,
    });
  } catch (error) {
    console.error(error);
    return ctx.throw(400, 'could not retrieve token');
  }

  ctx.status = 200;

  const access_token = (token.data as { access_token: string }).access_token;
  const decodedToken = jwt.decode(
    (token.data as IAuth0TokenResponse).access_token
  ) as IAuth0Token;

  return (ctx.body = {
    access_token,
    expiresIn: decodedToken.exp,
  });
});
