import Router from 'koa-router';
import Multer from 'koa-multer';
import { createFavourValidator } from '../validators/createFavourValidator';
import { uploadFileValidator } from '../validators/uploadFileValidator';
import { ValidationError } from 'joi';

export const favourRouter = new Router();

favourRouter.get('/favour', (ctx) => {
  return (ctx.body = { message: 'this is a favour' });
});

favourRouter.post('/favour', async (ctx) => {
  const body = ctx.request.body;

  try {
    await createFavourValidator.validateAsync(body, { abortEarly: false });
  } catch (error) {
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
  }

  ctx.status = 200;
  return (ctx.body = body);
});

// Created a new Post method for the file. Still not complete.
const upload = Multer(); // Added a global variable so it can be called in the POST method.
favourRouter.post('/upload', upload.single('file'), async (ctx) => {
  try {
    await uploadFileValidator.validateAsync(upload, { abortEarly: false });
  } catch (error) {
    ctx.status = 400;
    return (ctx.body = (error as ValidationError).message);
  }

  ctx.status = 200;
  return (ctx.body = upload);
});
