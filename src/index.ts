import Koa from 'koa';
import body from 'koa-body';
import cors from '@koa/cors';

// middleware
import { tokenVerifier } from './middleware/security';

// routes
import { favourRouter } from './routes/favours';
import { userRouter } from './routes/user';
import { authRouter } from './routes/auth';
import { publicRequestRouter } from './routes/publicRequest';

// create new app
const app = new Koa();

app.use(cors());
app.use(body({ multipart: true }));
app.use(tokenVerifier);
app.use(favourRouter.routes());
app.use(userRouter.routes());
app.use(authRouter.routes());
app.use(publicRequestRouter.routes());

// start the server
app.listen(8080, () => {
  console.log('listening on 8080');
});
