import { Express } from 'express';

import { Routes } from '../../../src/infrastructure/routes';

import { Actors } from '../../../src/infrastructure/controller';

import { Actors as actorsMiddleware } from '../../../src/infrastructure/middlewares';

describe('The router', () => {
    let routerMock: { get: jest.Mock };

    beforeEach(() => {
        routerMock = {
            get: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should load two routes', () => {
        Routes.loadRoutes(routerMock as unknown as Express);

        expect(routerMock.get).toBeCalledTimes(2);
    });

    it('should load the correct calls for /actors route', () => {
        Routes.loadRoutes(routerMock as unknown as Express);

        expect(routerMock.get as jest.Mock).toBeCalledWith('/actors', Actors.getAll);
    });

    it('should load the correct calls for /actors/:id route', () => {
        Routes.loadRoutes(routerMock as unknown as Express);

        expect(routerMock.get as jest.Mock).toBeCalledWith(
            '/actors/:id',
            actorsMiddleware.checkActorId,
            Actors.getById,
        );
    });
});
