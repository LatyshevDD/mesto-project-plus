import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import {
  getCards, postCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';
import { mongoIdRegEx } from '../constants/constants';

const cardRouter = Router();

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), postCard);
cardRouter.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().regex(mongoIdRegEx).required(),
  }),
}), deleteCard);
cardRouter.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().regex(mongoIdRegEx).required(),
  }),
}), likeCard);
cardRouter.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().regex(mongoIdRegEx).required(),
  }),
}), dislikeCard);

export default cardRouter;
