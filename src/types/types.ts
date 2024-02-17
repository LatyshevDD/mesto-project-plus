import { Request } from 'express';
import jwt from 'jsonwebtoken';

export enum ErrorsStatus {
  STATUS_OK = 200,
  STATUS_NOT_FOUND = 404,
  STATUS_BAD_REQUEST = 400,
  STATUS_INTERNAL_SERVER_ERROR = 500,
  STATUS_AUTH_ERROR = 401,
  STATUS_EMAIL_ERROR = 409,
}

export enum SuccessStatus {
  STATUS_CREATED = 201,
}
export interface IError extends Error {
  statusCode: number;
}

export interface IRequest extends Request {
  user?: { _id: string | jwt.JwtPayload };
}
