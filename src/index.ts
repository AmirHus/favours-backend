import Koa from 'koa';
// import BodyParser from 'koa-bodyparser';
import body from 'koa-body';
import cors from '@koa/cors';

import { tokenVerifier } from './middleware/security';

import { favourRouter } from './routes/favours';
import { userRouter } from './routes/user';
import { authRouter } from './routes/auth';
import { publicRequestRouter } from './routes/publicRequest';

const app = new Koa();

app.use(cors());
app.use(body({ multipart: true }));
app.use(tokenVerifier);
app.use(favourRouter.routes());
app.use(userRouter.routes());
app.use(authRouter.routes());
app.use(publicRequestRouter.routes());

app.listen(8080, () => {
  console.log('listening on 8080');
});
