import { connection } from '../../../src/model/connection';
import { Actors } from '../../../src/model/Actors';

afterAll(async () => {
  await connection.end();
});

describe('The actor model', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAll', () => {
    let spyConnect: jest.SpyInstance;
    let spyObject: { [key: string]: jest.SpyInstance };

    beforeEach(() => {
      spyObject = {
        query: jest.fn(async (query: string) => Promise.resolve(
          {
            query,
            rows: [
              { id: 1, first_name: 'PETER', last_name: 'BERKMAN' },
              { id: 2, first_name: 'JAMES', last_name: 'DEVITO' },
            ],
          },
        )),
        release: jest.fn(async () => true),
      };

      spyConnect = jest.spyOn(connection, 'connect')
        .mockImplementationOnce(() => Promise.resolve(spyObject));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should execute connection exactly one time', async () => {
      await Actors.getAll();

      expect(spyConnect).toBeCalledTimes(1);
    });

    it('should query only after the connection is established', async () => {
      await Actors.getAll();

      const connectionCallOrder = spyConnect.mock.invocationCallOrder[0];
      const queryCallOrder = spyObject.query.mock.invocationCallOrder[0];

      expect(connectionCallOrder).toBeLessThan(queryCallOrder);
    });

    it('should release client after the query is done', async () => {
      await Actors.getAll();

      const queryCallOrder = spyObject.query.mock.invocationCallOrder[0];
      const releaseCallOrder = spyObject.release.mock.invocationCallOrder[0];

      expect(queryCallOrder).toBeLessThan(releaseCallOrder);
    });

    it('should return the query rows', async () => {
      const expected = [
        { id: 1, first_name: 'PETER', last_name: 'BERKMAN' },
        { id: 2, first_name: 'JAMES', last_name: 'DEVITO' },
      ];

      const actors = await Actors.getAll();

      expect(actors).toStrictEqual(expected);
    });

    it('should return null on error', async () => {
      spyObject.query.mockImplementationOnce(() => {
        throw new Error('Something went wrong');
      });

      const error = await Actors.getAll();

      expect(error).toBeNull();
    });
  });

  describe('getById', () => {
    let spyConnect: jest.SpyInstance;
    let spyObject: { [key: string]: jest.SpyInstance };

    beforeEach(() => {
      spyObject = {
        query: jest.fn(async (query: string, value: any[]) => Promise.resolve(
          {
            query: [query, value],
            rows: [
              { id: 1, first_name: 'PETER', last_name: 'BERKMAN' },
            ],
          },
        )),
        release: jest.fn(async () => true),
      };

      spyConnect = jest.spyOn(connection, 'connect')
        .mockImplementationOnce(() => Promise.resolve(spyObject));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should execute connection exactly one time', async () => {
      await Actors.getById(1);

      expect(spyConnect).toBeCalledTimes(1);
    });

    it('should query only after the connection is established', async () => {
      await Actors.getById(1);

      const connectionCallOrder = spyConnect.mock.invocationCallOrder[0];
      const queryCallOrder = spyObject.query.mock.invocationCallOrder[0];

      expect(connectionCallOrder).toBeLessThan(queryCallOrder);
    });

    it('should release client after the query is done', async () => {
      await Actors.getById(1);

      const queryCallOrder = spyObject.query.mock.invocationCallOrder[0];
      const releaseCallOrder = spyObject.release.mock.invocationCallOrder[0];

      expect(queryCallOrder).toBeLessThan(releaseCallOrder);
    });

    it('should return the query rows', async () => {
      const expected = [
        { id: 1, first_name: 'PETER', last_name: 'BERKMAN' },
      ];

      const actor = await Actors.getById(1);

      expect(actor).toStrictEqual(expected);
    });

    it('should return null on error', async () => {
      spyObject.query.mockImplementationOnce(() => {
        throw new Error('Something went wrong');
      });

      const error = await Actors.getById(1);

      expect(error).toBeNull();
    });
  });
});
