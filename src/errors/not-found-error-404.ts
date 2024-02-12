import { ErrorsStatus } from '../types/types';

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ErrorsStatus.STATUS_NOT_FOUND;
  }
}
