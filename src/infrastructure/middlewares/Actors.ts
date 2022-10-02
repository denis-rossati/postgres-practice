import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { httpCodes } from '../httpCodes';
import { ClientError } from '../error/ClientError';

export class Actors {
  public static checkActorId(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.string().pattern(/^\d+$/).required();
    const result = schema.validate(req.params.id);

    if (!result.error) {
      next();
    } else {
      const error = new ClientError(httpCodes.badRequest, result.error.message, result.error.details);
      next(error);
    }
  }
}
