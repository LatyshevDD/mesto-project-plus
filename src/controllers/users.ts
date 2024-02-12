import User from "../models/user";
import { Request, Response, NextFunction } from 'express';
import NotFoundError from "../errors/not-found-error-404";
import NotCorrectDataError from "../errors/not-correct-data-400";
import { ErrorsStatus } from "../types/types";
import { ObjectId } from "bson";
import mongoose, {Error as MongooseError } from "mongoose";

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
    res.status(ErrorsStatus.STATUS_OK).send(user);
  } catch (error: any) {
    if (error instanceof NotFoundError && error.message === "Пользователь по указанному _id не найден.") {
      return next(error)
    };
    if(error instanceof MongooseError.CastError) {
      const err = new NotCorrectDataError("Переданы некорректные данные при запросе информации о пользователе")
      return next(err)
    };
  }
};

export const postUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => {
      if(!name || !about || !avatar) {
        throw new NotCorrectDataError ("Переданы некорректные данные при создании пользователя.")
      }
      res.send({ data: user })
    })
    .catch(err => next(err));
};