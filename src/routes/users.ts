import { Router } from 'express';
import { getUser, getUsers } from '../controllers/users';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUser);

export default userRouter;