import express from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

const { PORT = 3000 } = process.env;

const app = express();

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

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`)
})