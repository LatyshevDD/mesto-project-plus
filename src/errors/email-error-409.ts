import { ErrorsStatus } from '../types/types';

export default class EmailError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ErrorsStatus.STATUS_EMAIL_ERROR;
  }
}
