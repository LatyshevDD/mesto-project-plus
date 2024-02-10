import { Router } from 'express';
import { getUser, getUsers } from '../controllers/users';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.post('/users/:userId', getUser);

export default userRouter;