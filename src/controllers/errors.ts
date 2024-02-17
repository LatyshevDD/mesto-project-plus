import { IError, ErrorsStatus } from '../types/types';
import { Response, Request, NextFunction } from 'express';

export const rootErrorsController = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = ErrorsStatus.STATUS_INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка по умолчанию'
        : message
    });
}