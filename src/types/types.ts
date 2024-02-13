import { Request } from 'express';

export enum ErrorsStatus {
  STATUS_OK = 200,
  STATUS_NOT_FOUND = 404,
  STATUS_BAD_REQUEST = 400,
  STATUS_INTERNAL_SERVER_ERROR = 500,
}
export interface IError {
  statusCode: number;
  message: string;
}

export interface IRequest extends Request {
  user?: { _id: string };
}
