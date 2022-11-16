import express from 'express';

import * as dotenv from 'dotenv';

import { Routes } from './src/infrastructure/routes';

import { ErrorHandler } from './src/infrastructure/error';

import { Shutdown } from './src/infrastructure/shutdown/Shutdown';

dotenv.config();
const app = express();

Routes.loadRoutes(app);
ErrorHandler.express(app);

// @todo: Create some more routes
// @todo: Implement observability
// @todo: Create mailing on error
// @todo: Implement caching
// @todo: Create routes with expensive queries

const port = process.env.PORT || 3000;

const server = app.listen(port);

const shutdown = new Shutdown(server).watchServer();

process.on('SIGTERM', () => {
    shutdown.reap();
});

export {
    app,
    server,
};
