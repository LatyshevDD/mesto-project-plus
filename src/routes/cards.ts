import { Router } from 'express';
import { getCards, postCard, deleteCard } from '../controllers/cards';
import { celebrate, Joi } from 'celebrate';

const cardRouter = Router();

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
}), postCard);
cardRouter.delete('/cards/:cardId', deleteCard);

export default cardRouter;