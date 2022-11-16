import express from 'express';
import { Server } from 'http';
import { Shutdown } from '../../../../src/infrastructure/shutdown/Shutdown';

let server: Server;

beforeEach(() => {
    const app = express();

    app.get('/fast', (_req, res) => {
        res.send('fast');
    });

    app.get('/slow', (_req, res) => {
        setTimeout(() => {
            res.send('slow');
        }, 3000);
    });

    server = app.listen(3001);
});

afterEach(() => {
    server.close();
});

describe('The Shutdown class', () => {
    describe.only('when watching the server', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should call onConnection method for connections', () => {
            const spyServer = { on: jest.fn() } as unknown as Server;
            const shutdownManager = new Shutdown(spyServer).watchServer();

            expect(spyServer.on).toBeCalledTimes(2);
            expect(spyServer.on).toBeCalledWith('connection', shutdownManager.onConnection);
        });

        it('should call onRequest method for requests', () => {
            const spyServer = { on: jest.fn() } as unknown as Server;
            const shutdownManager = new Shutdown(spyServer).watchServer();

            expect(spyServer.on).toBeCalledTimes(2);
            expect(spyServer.on).toBeCalledWith('request', shutdownManager.onRequest);
        });

        it('should watch exactly 2 events', () => {
            const spyServer = { on: jest.fn() } as unknown as Server;

            new Shutdown(spyServer).watchServer();

            expect(spyServer.on).toBeCalledTimes(2);
        });

        it('should return the class methods', () => {
            const spyServer = { on: jest.fn() } as unknown as Server;
            const shutdownManager = new Shutdown(spyServer);

            expect(shutdownManager.watchServer()).toBe(shutdownManager);
        });

        it('should set watching mode to true', () => {
            let shutdownManager = new Shutdown(server);

            expect(() => {
                shutdownManager.reap();
            }).toThrowError('The server must be on watch to be reaped.');

            shutdownManager = new Shutdown(server).watchServer();

            expect(() => {
                shutdownManager.reap();
            }).not.toThrow();
        });
    });

    describe.only('when reaping the server', () => {
        it('must throw error if the server isn\'t on watch mode', () => {
            const shutdownManager = new Shutdown(server);

            const catchError = () => shutdownManager.reap();

            expect(catchError).toThrowError('The server must be on watch to be reaped.');
        });

        it('should delete every connection when the reaping is finished', () => {
            const shutdownManager = new Shutdown(server).watchServer();

            server.emit('connection');

            let connections = Object.keys(shutdownManager.getConnections());

            expect(connections.length).toBe(1);

            shutdownManager.reap();

            connections = Object.keys(shutdownManager.getConnections());

            expect(connections.length).toBe(0);
        });

        it('should call Shutdown.closeConnection one time for each tracked connection', () => {
            const shutdownManager = new Shutdown(server).watchServer();

            [1, 2, 3, 4, 5].forEach(() => server.emit('connection'));

            shutdownManager.reap();

            expect(1).toBe(2);
        });
    });

    describe.only('when watching a connection', () => {
        it('should be listed in the tracked connections', () => {
            expect(1).toBe(2);
        });

        it('should be deleted from the tracked connections after the connection is closed', () => {
            expect(1).toBe(2);
        });

        it('should execute callback if supplied', () => {
            expect(1).toBe(2);
        });

        it('should increase the connection id one by one', () => {
            expect(1).toBe(2);
        });
    });

    describe('when watching a request', () => {
        it('should close a connection if its idle', () => {
            expect(1).toBe(2);
        });

        it('should execute callback if supplied', () => {
            expect(1).toBe(2);
        });
    });

    describe('when closing a connection', () => {
        it('should only close idle connections', () => {
            expect(1).toBe(2);
        });

        it('should close connections with "end" method', () => {
        });
    });
});
