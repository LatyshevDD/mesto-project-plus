import express, { Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { IError } from './types/types';
import { IRequest } from './types/types';
import rootRouter from './routes';
import { rootErrorsController } from './controllers/errors';
import { ErrorsStatus } from './types/types';
import { errors } from 'celebrate';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import NotFoundError from './errors/not-found-error-404';

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

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
