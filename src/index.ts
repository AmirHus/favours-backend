import Koa from 'koa';
import BodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { favourRouter } from './routes/favours';
import { userRouter } from './routes/user';
import { authRouter } from './routes/auth';

const app = new Koa();

app.use(cors());
app.use(BodyParser());
app.use(favourRouter.routes());
app.use(userRouter.routes());
app.use(authRouter.routes());

app.listen(8080, () => {
  console.log('listening on 8080');
});
