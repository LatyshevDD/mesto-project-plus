import NotFoundError from "../errors/not-found-error-404";
import { Request } from "express";

export interface IError {
  statusCode: number;
  message: string;
}

export interface IRequest extends Request {
  user?: { _id: string };
}