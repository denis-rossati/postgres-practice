import {
    Application, NextFunction, Request, Response,
} from 'express';

import { ClientError, ErrorHandler } from '../../../../src/infrastructure/error';

import { httpCodes } from '../../../../src/infrastructure/httpCodes';

describe('The ErrorHandler', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call the status the client presentation if an error is raised', () => {
        const reqMock = {
            params: { id: 1 },
        } as unknown as Request;

        const resProps = {
            json: jest.fn(),
        };

        const resMock = {
            status: jest.fn(() => resProps),
        } as unknown as Response;

        const nextMock = jest.fn() as unknown as NextFunction;

        const error = new ClientError(httpCodes.internalServerError, 'foo');

        ErrorHandler.expressHandler(error, reqMock, resMock, nextMock);

        const expectedStatus = error.getStatus();

        expect(resMock.status).toBeCalledWith(expectedStatus);

        const expectedPresentation = error.presentToClient();

        expect(resProps.json).toBeCalledWith(expectedPresentation);
    });

    it('should pass the error through the next callback if an error is raised', () => {
        const reqMock = {
            params: { id: 1 },
        } as unknown as Request;

        const resProps = {
            json: jest.fn(),
            status: jest.fn(),
        };

        const resMock = {
            json: jest.fn(() => resProps),
            status: jest.fn(() => resProps),
        } as unknown as Response;

        const nextMock = jest.fn((error?: ClientError) => error) as unknown as NextFunction;

        const error = new ClientError(httpCodes.internalServerError, 'foo');

        ErrorHandler.expressHandler(error, reqMock, resMock, nextMock);

        expect(nextMock).toBeCalledTimes(1);
        expect(nextMock).toBeCalledWith(error);
    });

    it('should use the express method for general error handling', () => {
        const app = {
            use: jest.fn(),
        };

        ErrorHandler.express(app as unknown as Application);

        expect(app.use).toBeCalledWith(ErrorHandler.expressHandler);
    });
});
