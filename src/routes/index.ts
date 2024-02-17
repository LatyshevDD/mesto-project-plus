import { Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';

const rootRouter = Router();

rootRouter.use(userRouter, cardRouter);

export default rootRouter;
