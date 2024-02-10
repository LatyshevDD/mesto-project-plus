import { Router } from 'express';
import { getCards, postCard } from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', postCard);

export default cardRouter;