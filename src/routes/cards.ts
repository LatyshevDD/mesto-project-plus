import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import {
  getCards, postCard, deleteCard, likeCard, dislikeCard,
} from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), postCard);
cardRouter.delete('/cards/:cardId', deleteCard);
cardRouter.put('/cards/:cardId/likes', likeCard);
cardRouter.delete('/cards/:cardId/likes', dislikeCard);

export default cardRouter;
