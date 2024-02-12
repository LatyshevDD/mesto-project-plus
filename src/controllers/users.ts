import User from "../models/user";
import { Request, Response, NextFunction } from 'express';
import NotFoundError from "../errors/not-found-error-404";
import NotCorrectDataError from "../errors/not-correct-data-400";
import { ErrorsStatus, IRequest } from "../types/types";
import { ObjectId } from "bson";
import mongoose, {Error as MongooseError } from "mongoose";
import { isCelebrateError } from "celebrate";

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then(users => res.send({data: users}))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }))
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден.')
    });
    res.status(ErrorsStatus.STATUS_OK).send({data: user});
  } catch (error: any) {
    if (error instanceof NotFoundError && error.message === "Пользователь по указанному _id не найден.") {
      return next(error)
    };
    if(error instanceof MongooseError.CastError) {
      const customError = new NotCorrectDataError("Переданы некорректные данные при запросе информации о пользователе")
      return next(customError)
    };
    return next(error);
  }
};

export const postUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => {
      res.send({ data: user })
    })
    .catch(error => {
      return next(error);
    });
};

export const updateUser = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const _id  = req.user && req.user._id;
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(_id, { name: name, about: about }, {new: true}).orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден.')
    });
    res.status(ErrorsStatus.STATUS_OK).send({data: updatedUser});
  } catch(error: any) {
    if (error instanceof NotFoundError && error.message === "Пользователь по указанному _id не найден.") {
      return next(error)
    };
    if(error instanceof MongooseError.CastError) {
      const customError = new NotCorrectDataError("Переданы некорректные данные при запросе информации о пользователе")
      return next(customError)
    };
    return next(error);
  }
}