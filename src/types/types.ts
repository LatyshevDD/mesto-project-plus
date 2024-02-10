import NotFoundError from "../errors/not-found-error-404";

export interface IError {
  statusCode: number;
  message: string;
}