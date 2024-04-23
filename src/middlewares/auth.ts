import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { IRequest } from '../types/types';
import AuthError from '../errors/auth-error-401';


let key = 'some-secret-key';
if (process.env.JWT_SECRET) {
  key = process.env.JWT_SECRET;
}
export default (req: IRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AuthError('Ошибка авторизации');
  }

  let payload;

  try {
    payload = jwt.verify(token, key) as JwtPayload;
  } catch (err) {
    throw new AuthError('Ошибка авторизации');
  }

  req.user = {
    _id: payload._id,
  };

  next();
};
