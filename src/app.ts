import express, { Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import { IError } from './types/types';
import { IRequest } from './types/types';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import { ErrorsStatus } from './types/types';
import { errors } from 'celebrate';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.get('/', (req: Request, res: Response) => {
  res.send(
        `<html>
        <body>
            <p>Ответ на сигнал из далёкого космоса</p>
        </body>
        </html>`
    );
});

app.use((req: IRequest, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65c72bb6a5e2c2c8ca4e35fb'
  };

  next();
});

app.use('/', userRouter);
app.use('/', cardRouter);

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
})