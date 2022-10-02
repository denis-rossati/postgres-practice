import { Request, Response } from 'express';
import { Actors as ActorsService } from '../../domain/service/Actors';
import { httpCodes } from '../httpCodes';

export class Actors {
  public static async getById(req: Request, res: Response) {
    const actor = await ActorsService.getById(Number(req.params.id));
    if (actor === null) {
      return res.status(httpCodes.noContent).json({ message: 'No actor found', payload: {} });
    }
    return res.status(httpCodes.success).json({ payload: actor });
  }

  public static async getAll(req: Request, res: Response) {
    const actors = await ActorsService.getAll();
    return res.status(httpCodes.success).json({ payload: actors });
  }
}
