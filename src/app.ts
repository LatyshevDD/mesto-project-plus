import express, { Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { IError } from './types/types';
import { IRequest } from './types/types';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { ErrorsStatus } from './types/types';
import { errors } from 'celebrate';
import NotFoundError from './errors/not-found-error-404';

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: IRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65c72bb6a5e2c2c8ca4e35fb'
  };

  next();
});

app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req: Request, res: Response) => {
  res
    .status(ErrorsStatus.STATUS_NOT_FOUND)
    .send({ message: 'Запрашиваемый ресурс не найден' });
});
app.use(errors());

app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = ErrorsStatus.STATUS_INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка по умолчанию'
        : message
    });
});

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`)
});
