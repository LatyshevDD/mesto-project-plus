import { Router } from 'express';
import { getUser, getUsers } from '../controllers/users';
import { postUser } from '../controllers/users';
import { celebrate, Joi } from 'celebrate';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUser);
userRouter.post('/users', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
    avatar: Joi.string().required()
  }),
}), postUser);

export default userRouter;