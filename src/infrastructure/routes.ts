import { Express } from 'express';
import { Actors } from './controller';
import { Actors as actorsMiddleware } from './middlewares';

export class Routes {
  public static loadRoutes(router: Express) {
    router.get('/actors', Actors.getAll);
    router.get('/actors/:id', actorsMiddleware.checkActorId, Actors.getById);
  }
}
