import express, { Request, Response, NextFunction} from 'express';
import { celebrate, Joi } from 'celebrate';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rootRouter from './routes';
import { rootErrorsController } from './controllers/errors';
import { errors } from 'celebrate';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import NotFoundError from './errors/not-found-error-404';
import { urlRegEx } from './constants/constants';

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().regex(urlRegEx).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}) ,createUser);

app.use(auth);

app.use('/', rootRouter);

app.use('*', (req: Request, res: Response, next: NextFunction) => {
  const customError = new NotFoundError('Запрашиваемый ресурс не найден');
  return next(customError);
});

app.use(errorLogger);

app.use(errors());

app.use(rootErrorsController);

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`)
});
