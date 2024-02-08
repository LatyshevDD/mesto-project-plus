import User from "../models/user";
import { Request, Response } from 'express';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then(users => res.send(users))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }))
}