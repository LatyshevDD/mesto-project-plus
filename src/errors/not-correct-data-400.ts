import { ErrorsStatus } from '../types/types';

export default class NotCorrectDataError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ErrorsStatus.STATUS_BAD_REQUEST;
  }
}
