import { Middleware } from 'koa';
import * as jwt from 'jsonwebtoken';
import { AUTH0 } from '../config';
import JwksClient, {
  SigningKey,
  CertSigningKey,
  RsaSigningKey,
} from 'jwks-rsa';
import { getUserById } from '../dbqurries/userDataAccess';
import { IAuth0Token } from '../interfaces/iAuth0Token';

const publicKeySet = JwksClient({
  jwksUri: AUTH0.JWKS_URI,
});

export const tokenVerifier: Middleware = async (ctx, next) => {
  if (exempt.includes(ctx.req.url as string)) {
    return next();
  }

  const token = ctx.req.headers.authorization;

  if (!token) {
    return ctx.throw(401, 'No token');
  }

  const validToken = token.replace('Bearer ', '');
  let decodedToken;
  try {
    decodedToken = await (() => {
      return new Promise((resolve, reject) => {
        jwt.verify(
          validToken,
          getKey,
          undefined,
          (error: jwt.VerifyErrors, decoded: object | string) => {
            if (!error) {
              return resolve(decoded);
            }
            reject(error);
          }
        );
      });
    })();
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return ctx.throw(401, 'Token expired');
    }
    return ctx.throw(401, 'Invalid token');
  }
  const auth0User = decodedToken as IAuth0Token;
  const user = await getUserById(auth0User.sub);
  if (!user) ctx.throw(401, 'user does not exist');
  ctx.state = { auth0User, user };
  return next();
};

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback): void {
  if (!header.kid) {
    return;
  }

  publicKeySet.getSigningKey(
    header.kid,
    (err: Error | null, key: SigningKey) => {
      if (err) {
        console.log(err);
        callback(err);
        return;
      }
      const signingKey =
        (key as CertSigningKey).publicKey ||
        (key as RsaSigningKey).rsaPublicKey;
      callback(null, signingKey);
      return;
    }
  );
}

const exempt = ['/auth/token', '/user', '/availablePublicRequest'];
