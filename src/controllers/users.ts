import User from "../models/user";
import { Request, Response, NextFunction } from 'express';
import NotFoundError from "../errors/not-found-error-404";
import NotCorrectDataError from "../errors/not-correct-data-400";

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then(users => res.send({data: users}))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }))
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      };

      res.send({ data: user });
    })
    .catch(err => next(err));
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