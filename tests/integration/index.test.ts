import request from 'supertest';
import { app } from '../../index';
import { connection } from '../../src/model/connection';

afterAll(async () => {
  await connection.end();
});

describe('GET /actors ', () => {
  describe('when the response is successful', () => {
    let spyObject: { [key: string]: jest.SpyInstance };
    const mockData = [
      { id: 1, first_name: 'PETER', last_name: 'BERKMAN' },
      { id: 2, first_name: 'JAMES', last_name: 'DEVITO' },
    ];

    beforeEach(() => {
      spyObject = {
        query: jest.fn(async (query: string) => Promise.resolve(
          {
            query,
            rows: mockData,
          },
        )),
        release: jest.fn(async () => true),
      };

      jest.spyOn(connection, 'connect')
        .mockImplementationOnce(() => Promise.resolve(spyObject));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return status code 200 and all the actors', async () => {
      const response = await request(app).get('/actors');

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({ payload: mockData });
    });
  });

  describe('when the response is null', () => {
    let spyObject: { [key: string]: jest.SpyInstance };

    beforeEach(() => {
      spyObject = {
        query: jest.fn(async () => {
          throw new Error('something exploded');
        }),
        release: jest.fn(async () => true),
      };

      jest.spyOn(connection, 'connect')
        .mockImplementationOnce(() => Promise.resolve(spyObject));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return status code 500 and an apology message', async () => {
      const response = await request(app).get('/actors');

      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({ message: 'Our bad. Internal server error' });
    });
  });
});

describe('GET /actors/:id ', () => {
  describe('when the service returns null', () => {
    let spyObject: { [key: string]: jest.SpyInstance };

    beforeEach(() => {
      spyObject = {
        query: jest.fn(async () => {
          throw new Error('something exploded');
        }),
        release: jest.fn(async () => true),
      };

      jest.spyOn(connection, 'connect')
        .mockImplementationOnce(() => Promise.resolve(spyObject));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return status code 500 and an apology message', async () => {
      const response = await request(app).get('/actors/1');

      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({ message: 'Our bad. Internal server error' });
    });
  });

  describe('when the service returns an empty object', () => {
    let spyObject: { [key: string]: jest.SpyInstance };

    beforeEach(() => {
      spyObject = {
        query: jest.fn(async () => ({
          rows: [],
        })),
        release: jest.fn(async () => true),
      };

      jest.spyOn(connection, 'connect')
        .mockImplementationOnce(() => Promise.resolve(spyObject));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return status code 204 and and empty body', async () => {
      const response = await request(app).get('/actors/1');

      expect(response.statusCode).toBe(204);
      expect(response.body).toStrictEqual({});
    });
  });

  describe('when the service finds the valid actor', () => {
    let spyObject: { [key: string]: jest.SpyInstance };
    const mockData = [
      { id: 1, first_name: 'PETER', last_name: 'BERKMAN' },
      { id: 2, first_name: 'JAMES', last_name: 'DEVITO' },
    ];

    beforeEach(() => {
      spyObject = {
        query: jest.fn(async () => ({
          rows: Promise.resolve(mockData),
        })),
        release: jest.fn(async () => true),
      };

      jest.spyOn(connection, 'connect')
        .mockImplementationOnce(() => Promise.resolve(spyObject));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('the id in the params and in the response should match', async () => {
      const expectedId = 1;
      const response = await request(app).get(`/actors/${expectedId}`);

      expect(response.body.payload.actor.id).toBe(expectedId);
    });

    it('should return status 200 and the respective actor', async () => {
      const response = await request(app).get('/actors/1');

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({ payload: { actor: mockData[0] } });
    });
  });
});
