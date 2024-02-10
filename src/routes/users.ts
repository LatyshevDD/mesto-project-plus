import { Router } from 'express';
import { getUser, getUsers } from '../controllers/users';
import { postUser } from '../controllers/users';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUser);
userRouter.post('/users', postUser);

export default userRouter;