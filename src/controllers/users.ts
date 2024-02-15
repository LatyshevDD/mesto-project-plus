import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error-404';
import NotCorrectDataError from '../errors/not-correct-data-400';
import { ErrorsStatus, IRequest, SuccessStatus } from '../types/types';
import { MongoError } from 'mongodb';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    });
    return res.status(ErrorsStatus.STATUS_OK).send({ data: user });
  } catch (error: any) {
    if (error instanceof MongooseError.CastError) {
      const customError = new NotCorrectDataError('Переданы некорректные данные при запросе информации о пользователе');
      return next(customError);
    }
    return next(error);
  }
};

export const postUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => {
      return User.create({ name, about, avatar, email, password: hash })
    })
    .then((user) => {
      res.status(SuccessStatus.STATUS_CREATED).send({ data: user })
    })
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        const customError = new NotCorrectDataError('Переданы некорректные данные при запросе информации о пользователе');
        return next(customError);
      }
      if (error instanceof MongoError) {
        const customError = new NotCorrectDataError('Пользователь с таким email уже существует');
        return next(customError);
      }
      return next(error);
    });
};

export const updateUser = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const _id = req.user && req.user._id;
    const { name, about } = req.body;
    const updatedUser = await User
      .findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
      .orFail(() => {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      });
    return res.status(ErrorsStatus.STATUS_OK).send({ data: updatedUser });
  } catch (error: any) {
    if (error instanceof MongooseError.CastError) {
      const customError = new NotCorrectDataError('Переданы некорректные данные при запросе информации о пользователе');
      return next(customError);
    }
    return next(error);
  }
};

export const updateUserAvatar = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const _id = req.user && req.user._id;
    const { avatar } = req.body;
    const updatedUser = await User
      .findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
      .orFail(() => {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      });
    return res.status(ErrorsStatus.STATUS_OK).send({ data: updatedUser });
  } catch (error: any) {
    if (error instanceof MongooseError.CastError) {
      const customError = new NotCorrectDataError('Переданы некорректные данные при запросе информации о пользователе');
      return next(customError);
    }
    return next(error);
  }
};

// export const login = async (req: IRequest, res: Response, next: NextFunction) => {
//   try {
//     const { email, password } = req.body;
//     const updatedUser = await User
//       .findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
//       .orFail(() => {
//         throw new NotFoundError('Пользователь по указанному _id не найден.');
//       });
//     return res.status(ErrorsStatus.STATUS_OK).send({ data: updatedUser });
//   } catch (error: any) {
//     if (error instanceof MongooseError.CastError) {
//       const customError = new NotCorrectDataError('Переданы некорректные данные при запросе информации о пользователе');
//       return next(customError);
//     }
//     return next(error);
//   }
// };
