import express, { Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import { IError } from './types/types';
import userRouter from './routes/users';

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

app.use('/', userRouter);

app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

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