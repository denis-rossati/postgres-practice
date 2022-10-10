import { pool } from '../../../../src/model/connection';
import { Actors } from '../../../../src/domain/service/Actors';
import { Actors as ActorsModel } from '../../../../src/model/Actors';

describe('Get all actors', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach((done) => {
    done();
  });

  it('should return all users', async () => {
    const mockData = [
      { id: 1, first_name: 'PETER', last_name: 'BERKMAN' },
      { id: 2, first_name: 'JAMES', last_name: 'DEVITO' },
      { id: 3, first_name: 'LUKES', last_name: 'SILAS' },
    ];

    jest.spyOn(ActorsModel, 'getAll').mockResolvedValueOnce(new Promise((resolve) => {
      resolve(mockData);
    }));

    const data = await Actors.getAll();

    expect(data).toEqual(mockData);
  });

  it('should be called one time with DB connection', async () => {
    const spy = jest.spyOn(ActorsModel, 'getAll');

    await Actors.getAll();

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(pool);
  });
});

describe('Get actor by id', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach((done) => {
    done();
  });

  it('should return a single actor', async () => {
    const mockData = [
      { id: 1, first_name: 'PETER', last_name: 'BERKMAN' },
      { id: 2, first_name: 'JAMES', last_name: 'DEVITO' },
    ];

    jest.spyOn(ActorsModel, 'getById').mockReturnValueOnce(new Promise((resolve) => {
      resolve(mockData);
    }));

    const data = await Actors.getById(1);

    expect(data).toEqual(mockData[0]);
  });

  it('should return null if any actor is found', async () => {
    jest.spyOn(ActorsModel, 'getById').mockResolvedValueOnce(new Promise((resolve) => {
      resolve([]);
    }));

    const data = await Actors.getById(1);

    expect(data).toEqual(null);
  });

  it('should return null if DB returns null', async () => {
    jest.spyOn(ActorsModel, 'getById').mockResolvedValueOnce(new Promise((resolve) => {
      resolve(null);
    }));

    const data = await Actors.getById(1);

    expect(data).toEqual(null);
  });

  it('should be called one time with DB connection and actor id', async () => {
    const spy = jest.spyOn(ActorsModel, 'getById');

    await Actors.getById(1);
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(pool, 1);
  });
});
