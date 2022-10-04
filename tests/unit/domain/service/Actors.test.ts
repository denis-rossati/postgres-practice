import sinon from 'sinon';
import { client } from '../../../../src/model/connection';
import { Actors } from '../../../../src/domain/service/Actors';
import { Actors as ActorsModel } from '../../../../src/model/Actors';

describe('Get all actors', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return all users', async () => {
    const mockData = [
      { id: 1, first_name: 'PETER', last_name: 'BERKMAN' },
      { id: 2, first_name: 'JAMES', last_name: 'DEVITO' },
      { id: 3, first_name: 'LUKES', last_name: 'SILAS' },
    ];

    const modelMock = sinon.mock(ActorsModel);
    const data = await Actors.getAll();

    modelMock.expects('getAll').once().returns(mockData);
    modelMock.expects('getAll').exactly(1);
    modelMock.verify();

    expect(data).toEqual(mockData);
  });
});

describe('Get actor by id', () => {
  const mockData = [
    { id: 1, first_name: 'PETER', last_name: 'BERKMAN' },
    { id: 1, first_name: 'JAMES', last_name: 'DEVITO' },
  ];

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return a single actor', async () => {
    jest.spyOn(ActorsModel, 'getById').mockResolvedValueOnce(mockData);
    const data = await Actors.getById(1);
    expect(data).toEqual(mockData[0]);
    expect(ActorsModel.getById).toBeCalledWith(client, 1);
  });

  it('should return null if any actor is found', async () => {
    jest.spyOn(ActorsModel, 'getById').mockResolvedValueOnce([]);
    const data = await Actors.getById(1);
    expect(data).toEqual(null);
    expect(ActorsModel.getById).toBeCalledWith(client, 1);
  });
});
