import {
    Application, NextFunction, Request, Response,
} from 'express';

import { ClientError } from './ClientError';

export class ErrorHandler {
    public static express(app: Application) {
        app.use(ErrorHandler.expressHandler);
    }

    public static expressHandler(err: ClientError, req: Request, res: Response, next: NextFunction) {
        res.status(err.getStatus()).json(err.presentToClient());
        next(err);
    }
}
