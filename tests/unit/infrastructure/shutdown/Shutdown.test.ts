describe('The Shutdown class', () => {
    describe('when watching the server', () => {
        it('should call onConnection method for connections', () => {
        });

        it('should call onRequest method for requests', () => {
        });

        it('should return the class methods', () => {

        });

        it('should set watching mode to true', () => {
        });
    });

    describe('when reaping the server', () => {
        it('must throw error if the server isn\'t on watch mode', () => {
        });

        it('should delete every connection when the reaping is finished', () => {

        });

        it('should call Shutdown.closeConnection one time for each tracked connection', () => {

        });
    });

    describe('when watching a connection', () => {
        it('should be listed in the tracked connections', () => {

        });

        it('should be deleted from the tracked connections after the connection is closed', () => {

        });

        it('should execute callback if supplied', () => {

        });

        it('should increase the connection id one by one', () => {

        });
    });

    describe('when watching a request', () => {
        it('should close a connection if its idle', () => {

        });

        it('should execute callback if supplied', () => {

        });
    });

    describe('when closing a connection', () => {
        it('should only close idle connections', () => {

        });

        it('should close connections with "end" method', () => {
        });
    });
});
