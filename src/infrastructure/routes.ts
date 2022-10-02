import { Express } from 'express';
import { Actors } from './controller/Actors';
import * as middlewares from './middlewares';

export class Routes {
  public static loadRoutes(router: Express) {
    router.get('/actors', Actors.getAll);
    router.get('/actors/:id', middlewares.Actors.checkActorId, Actors.getById);
  }
}
