import { Response, Request } from 'express';
import { IError, ErrorsStatus } from '../types/types';

export const rootErrorsController = (
  err: IError,
  req: Request,
  res: Response,
) => {
  const { statusCode = ErrorsStatus.STATUS_INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка по умолчанию'
        : message,
    });
};
