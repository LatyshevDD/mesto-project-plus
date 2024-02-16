import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error-404';
import NotCorrectDataError from '../errors/not-correct-data-400';
import EmailError from '../errors/email-error-409';
import { ErrorsStatus, IRequest, SuccessStatus } from '../types/types';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    if (userId === 'me') {
      return next();
    }
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

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(SuccessStatus.STATUS_CREATED).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        const customError = new NotCorrectDataError('Переданы некорректные данные при запросе информации о пользователе');
        return next(customError);
      }
      if (error instanceof MongoError) {
        const customError = new EmailError('Пользователь с таким email уже существует');
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

export const login = (req: IRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  User
    .findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new NotFoundError('Введен непральный пароль или email');
    })
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new NotFoundError('Введен непральный пароль или email');
        }
        return user;
      }))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((error: any) => {
      if (error instanceof MongooseError.CastError) {
        const customError = new NotCorrectDataError('Переданы некорректные данные в процессе авторизации');
        return next(customError);
      }
      return next(error);
    });
};

export const getCurrentUser = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const _id = req.user && req.user._id;
    const user = await User.findById(_id).orFail(() => {
      throw new NotFoundError('Не удалось определить пользователя. Повторите авторизацию');
    });
    return res.status(ErrorsStatus.STATUS_OK).send({ data: user });
  } catch (error: any) {
    if (error instanceof MongooseError.CastError) {
      const customError = new NotCorrectDataError('Не удалось определить пользователя.  Повторите авторизацию');
      return next(customError);
    }
    return next(error);
  }
};
