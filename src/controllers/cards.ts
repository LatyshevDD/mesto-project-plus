import Card from "../models/card";
import NotCorrectDataError from "../errors/not-correct-data-400";
import NotFoundError from "../errors/not-found-error-404";
import { Request, Response, NextFunction } from 'express';
import { IRequest } from "../types/types";

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then(cards => res.send({data: cards}))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }))
};

export const postCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name: name, link: link, owner: req.user && req.user._id})
    .then(card => {
      if(!name || !link) {
        throw new NotCorrectDataError ("Переданы некорректные данные при создании карточки.")
      }
      res.send({ data: card })
    })
    .catch(err => next(err));
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(card => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      };
      res.send({ data: card })
    })
    .catch(err => next(err));
};