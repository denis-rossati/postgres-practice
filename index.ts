import express from 'express';

import * as dotenv from 'dotenv';

import { Routes } from './src/infrastructure/routes';

import { ErrorHandler } from './src/infrastructure/error/ErrorHandler';

dotenv.config();
const app = express();

Routes.loadRoutes(app);
ErrorHandler.express(app);

// @todo: Create tests
// @todo: Create some more routes
// @todo: Implement observability
// @todo: Create mailing on error
// @todo: Implement caching
// @todo: Create routes with expensive queries

const port = process.env.PORT || 3000;

app.listen(port, () => {
    if (process.env.ENVIRONMENT === 'development') {
    // eslint-disable-next-line no-console ---- to not bother the development flow.
        console.log(`port: ${port}`);
    }
});

export {
    app,
};
