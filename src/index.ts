import Koa from 'koa';
import BodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import { favourRouter } from './routes/favours';
import { userRouter } from './routes/user';

const app = new Koa();

app.use(cors());
app.use(BodyParser());
app.use(favourRouter.routes());
app.use(userRouter.routes());

app.listen(3000, () => {
  console.log('listening on 3000');
});
