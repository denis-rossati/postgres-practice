// inspired by @moebius/http-graceful-shutdown, but the lib seems abandoned.
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';

type Server = HttpsServer | HttpsServer;

// Keep track of connections and their status.
// And close all idle connections and make sure to close active connections after the request is processed.
export class Shutdown {
    connections: { [key: number]: NodeJS.Socket } = {};

    connectionId = 1;

    server: Server;

    constructor(server: Server) {
        this.server = server;

        this.watchServer();
    }

    private watchServer() {
        this.server.on('connection', () => {

        });
    }
}
