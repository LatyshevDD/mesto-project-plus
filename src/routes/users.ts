import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import {
  getUser, getUsers, updateUser, updateUserAvatar, getCurrentUser,
} from '../controllers/users';
import { urlRegEx } from '../constants/constance';

const userRouter = Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/me', getCurrentUser);
userRouter.get('/users/:userId', getUser);
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUser);
userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urlRegEx).required(),
  }),
}), updateUserAvatar);

export default userRouter;
