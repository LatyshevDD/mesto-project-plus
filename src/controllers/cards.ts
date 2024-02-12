import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-error-404';
import NotCorrectDataError from '../errors/not-correct-data-400';
import { IRequest, ErrorsStatus } from '../types/types';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

export const postCard = (req: IRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user && req.user._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => next(err));
};

export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndDelete(cardId).orFail(() => {
      throw new NotFoundError('Карточка по указанному _id не найдена.');
    });
    return res.status(ErrorsStatus.STATUS_OK).send({ data: card });
  } catch (error: any) {
    if (error instanceof NotFoundError && error.message === 'Карточка по указанному _id не найдена.') {
      return next(error);
    }
    if (error instanceof MongooseError.CastError) {
      const customError = new NotCorrectDataError('Переданы некорректные данные при запросе информации о пользователе');
      return next(customError);
    }
    return next(error);
  }
};

export const likeCard = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const _id = req.user && req.user._id;
    const { cardId } = req.params;
    const updatedCard = await Card
      .findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: _id } },
        { new: true },
      )
      .orFail(() => {
        throw new NotFoundError('Карточка по указанному _id не найдена.');
      });

    return res.status(ErrorsStatus.STATUS_OK).send({ data: updatedCard });
  } catch (error) {
    if (error instanceof NotFoundError && error.message === 'Карточка по указанному _id не найдена.') {
      return next(error);
    }
    if (error instanceof MongooseError.CastError) {
      const customError = new NotCorrectDataError('Переданы некорректные данные при запросе информации о пользователе');
      return next(customError);
    }
    return next(error);
  }
};

export const dislikeCard = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const _id = req.user && req.user._id;
    const { cardId } = req.params;
    const updatedCard = await Card
      .findByIdAndUpdate(
        cardId,
        { $pull: { likes: _id } },
        { new: true },
      )
      .orFail(() => {
        throw new NotFoundError('Карточка по указанному _id не найдена.');
      });

    return res.status(ErrorsStatus.STATUS_OK).send({ data: updatedCard });
  } catch (error) {
    if (error instanceof NotFoundError && error.message === 'Карточка по указанному _id не найдена.') {
      return next(error);
    }
    if (error instanceof MongooseError.CastError) {
      const customError = new NotCorrectDataError('Переданы некорректные данные при запросе информации о пользователе');
      return next(customError);
    }
    return next(error);
  }
};
