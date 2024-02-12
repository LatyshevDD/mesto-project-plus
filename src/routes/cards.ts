import { Router } from 'express';
import { getCards, postCard, deleteCard } from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', postCard);
cardRouter.delete('/cards/:cardId', deleteCard);

export default cardRouter;