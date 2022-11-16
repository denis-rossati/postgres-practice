import { Server as HttpServer, IncomingMessage, ServerResponse } from 'http';
import { Server as HttpsServer } from 'https';

type Server = HttpsServer | HttpServer;
type FlaggedConnection = { isIdle: boolean, connection: NodeJS.Socket };
type Connections = { [key: number]: FlaggedConnection };
type CallbackSignature = (server: Server, connections: Connections) => void;

/**
 * Keep track of connections and their status and close all idle connections and make sure to close active connections
 * after the request is processed.
 *
 * Some quick notes: This is strongly inspired by @moebius/http-graceful-shutdown, since the lib seems abandoned,
 * I tried to create a duplicate myself.
 * Also, yes, node handles end of connections by its own, but I want an excuse for trying some low level stuff.
 */
export class Shutdown {
    private connections: Connections = {};

    private connectionId = 1;

    private terminating = false;

    private watching = false;

    private readonly server: Server;

    constructor(server: Server) {
        this.server = server;
    }

    public reap() {
        if (!this.isWatching()) {
            throw new Error('The server must be on watch to be reaped.');
        }

        this.setTerminating(true);
        this.server.close();

        Object.keys(this.connections).forEach((key: string) => {
            const connection = this.connections[Number(key)];

            Shutdown.closeConnection(connection);

            delete this.connections[Number(key)];
        });
    }

    /**
   * Track each connection or request in the server.
   */
    public watchServer() {
        this.server.on('connection', this.onConnection);
        this.server.on('request', this.onRequest);

        this.setWatching(true);

        return this;
    }

    /**
   * Track a socket connection.
   * @param connection
   * @param callback
   */
    public onConnection(connection: NodeJS.Socket, callback?: CallbackSignature) {
        const flaggedConnection = { isIdle: true, connection };
        const { connectionId } = this;

        flaggedConnection.connection.on('close', () => delete this.connections[connectionId]);

        this.connections[connectionId] = flaggedConnection;
        this.setNextConnectionId();

        if (callback !== undefined) {
            callback(this.getServer(), this.getConnections());
        }
    }

    /**
   * Track a request.
   * @param request
   * @param response
   * @param callback
   */
    public onRequest(request: IncomingMessage, response: ServerResponse, callback?: CallbackSignature) {
        const { socket } = request;
        const flaggedConnection: FlaggedConnection = { isIdle: false, connection: socket };

        response.on('finish', () => {
            flaggedConnection.isIdle = true;

            if (this.terminating) {
                Shutdown.closeConnection(flaggedConnection);
            }
        });

        if (callback !== undefined) {
            callback(this.getServer(), this.getConnections());
        }
    }

    /**
   * Close a idle socket connection.
   * @param request
   * @private
   */
    private static closeConnection(request: FlaggedConnection) {
        if (request.isIdle) {
            const { connection } = request;

            connection.end();
        }
    }

    private setNextConnectionId() {
        const nextConnectionId = this.connectionId + 1;

        this.setConnectionId(nextConnectionId);
    }

    private setConnectionId(connectionId: number) {
        this.connectionId = connectionId;
    }

    private setTerminating(isTerminating: boolean) {
        this.terminating = isTerminating;
    }

    private setWatching(isWatching: boolean) {
        this.watching = isWatching;
    }

    private isWatching() {
        return this.watching;
    }

    public getConnections() {
        return this.connections;
    }

    public getServer() {
        return this.server;
    }
}
