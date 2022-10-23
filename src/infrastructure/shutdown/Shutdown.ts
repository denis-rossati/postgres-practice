// inspired by @moebius/http-graceful-shutdown, but the lib seems abandoned.
import { Server as HttpServer, IncomingMessage, ServerResponse } from 'http';
import { Server as HttpsServer } from 'https';

type Server = HttpsServer | HttpServer;
type FlaggedConnection = { isIdle: boolean, connection: NodeJS.Socket };
type Connections = { [key: number]: FlaggedConnection };

// Keep track of connections and their status and close all idle connections and make sure to close active connections
// after the request is processed.
export class Shutdown {
    private connections: Connections = {};

    private connectionId = 1;

    private terminating = false;

    server: Server;

    constructor(server: Server) {
        this.server = server;

        this.watchServer();
    }

    public reap() {
        this.setTerminating(true);
        this.server.close();

        Object.keys(this.connections).forEach((key: string) => {
            const connection = this.connections[Number(key)];

            Shutdown.closeConnection(connection);
        });
    }

    private watchServer() {
        this.server.on('connection', this.onConnection.bind(this));
        this.server.on('request', this.onRequest.bind(this));
    }

    private onConnection(connection: NodeJS.Socket) {
        const flaggedConnection = { isIdle: true, connection };
        const { connectionId } = this;

        flaggedConnection.connection.on('close', () => delete this.connections[connectionId]);

        this.connections[connectionId] = flaggedConnection;
        this.setNextConnectionId();
    }

    private onRequest(request: IncomingMessage, response: ServerResponse) {
        const { connection } = request;
        const flaggedConnection: FlaggedConnection = { isIdle: false, connection };

        response.on('finish', () => {
            flaggedConnection.isIdle = true;

            if (this.terminating) {
                Shutdown.closeConnection(flaggedConnection);
            }
        });
    }

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
}
