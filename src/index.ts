import Koa from 'koa';
import BodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Multer from 'koa-multer'; // imported the @koa-multer

import { favourRouter } from './routes/favours';
import { userRouter } from './routes/user';

const app = new Koa();

app.use(cors());
app.use(BodyParser());
app.use(favourRouter.routes());
app.use(userRouter.routes());
app.use(Multer); // added the declaration here

app.listen(3000, () => {
  console.log('listening on 3000');
});
