import { ValidationErrorItem } from 'joi';
import { httpCodes } from '../httpCodes';

type ValueOf<T> = T[keyof T];

export class ClientError {
  private readonly status: ValueOf<typeof httpCodes>;

  private readonly message: string;

  private readonly details: ValidationErrorItem[];

  constructor(status: ValueOf<typeof httpCodes>, message: string, details: ValidationErrorItem[] = []) {
    this.status = status;
    this.message = message;
    this.details = details;
  }

  public getStatus() {
    return this.status;
  }

  private getMessage() {
    return this.message;
  }

  private getDetails() {
    return this.details;
  }

  public presentToClient() {
    return {
      message: this.getMessage(),
      details: [
        ...this.getDetails().map(({ message }) => message),
      ],
    };
  }
}
