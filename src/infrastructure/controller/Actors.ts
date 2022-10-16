import { Request, Response } from 'express';
import { Actors as ActorsService } from '../../domain/service/Actors';
import { httpCodes } from '../httpCodes';

export class Actors {
  public static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const actor = await ActorsService.getById(id);

    if (actor === null) {
      res.status(httpCodes.internalServerError).json({ message: 'Our bad. Internal server error' });
      return;
    }

    const responseKeys = Object.keys(actor.actor);
    if (responseKeys.length === 3) {
      res.status(httpCodes.success).json({ payload: actor });
      return;
    }

    res.status(httpCodes.noContent).json({ message: 'No actor found', payload: { actor: {} } });
  }

  public static async getAll(req: Request, res: Response) {
    const actors = await ActorsService.getAll();

    if (actors === null) {
      res.status(httpCodes.internalServerError).json({ message: 'Our bad. Internal server error' });
      return;
    }

    res.status(httpCodes.success).json({ payload: actors });
  }
}
