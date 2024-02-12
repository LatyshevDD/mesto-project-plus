import Card from "../models/card";
import NotFoundError from "../errors/not-found-error-404";
import NotCorrectDataError from "../errors/not-correct-data-400";
import { Request, Response, NextFunction } from 'express';
import { IRequest } from "../types/types";
import {Error as MongooseError } from "mongoose";
import { ErrorsStatus } from "../types/types";

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then(cards => res.send({data: cards}))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }))
};

export const postCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name: name, link: link, owner: req.user && req.user._id})
    .then(card => {
      res.send({ data: card })
    })
    .catch(err => next(err));
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId).orFail(() => {
      throw new NotFoundError('Карточка по указанному _id не найдена.')
    });
    res.status(ErrorsStatus.STATUS_OK).send({data: card});
  } catch(error: any) {
    if (error instanceof NotFoundError && error.message === "Карточка по указанному _id не найдена.") {
      return next(error)
    };
    if(error instanceof MongooseError.CastError) {
      const customError = new NotCorrectDataError("Переданы некорректные данные при запросе информации о пользователе")
      return next(customError)
    };
    return next(error);
  }
};