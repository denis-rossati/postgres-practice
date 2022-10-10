import sinon from 'sinon';
import { client } from '../../../../src/model/connection';
import { Actors } from '../../../../src/domain/service/Actors';
import { Actors as ActorsModel } from '../../../../src/model/Actors';

describe('Get all actors', () => {
  const sandbox = sinon.createSandbox();

  afterEach((done) => {
    jest.restoreAllMocks();
    done();
  });

  it('should return all users', async () => {
    const mockData = [
      { id: 1, first_name: 'PETER', last_name: 'BERKMAN' },
      { id: 2, first_name: 'JAMES', last_name: 'DEVITO' },
      { id: 3, first_name: 'LUKES', last_name: 'SILAS' },
    ];

    const stub = sandbox.stub(ActorsModel, 'getAll').returns(new Promise((resolve) => {
      resolve(mockData);
    }));

    const data = await Actors.getAll();

    expect(data).toEqual(mockData);
    expect(stub.withArgs(client).calledOnce).toEqual(true);
  });
});

describe('Get actor by id', () => {
  const sandbox = sinon.createSandbox();
  afterEach((done) => {
    sandbox.restore();
    done();
  });

  it('should return a single actor', async () => {
    const mockData = [
      { id: 1, first_name: 'PETER', last_name: 'BERKMAN' },
      { id: 2, first_name: 'JAMES', last_name: 'DEVITO' },
    ];

    const stub = sandbox.stub(ActorsModel, 'getById').returns(new Promise((resolve) => {
      resolve(mockData);
    }));

    const data = await Actors.getById(1);

    expect(data).toEqual(mockData[0]);
    expect(stub.withArgs(client, 1).calledOnce).toEqual(true);
  });

  it('should return null if any actor is found', async () => {
    const stub = sandbox.stub(ActorsModel, 'getById').returns(new Promise((resolve) => {
      resolve([]);
    }));

    const data = await Actors.getById(1);

    expect(data).toEqual(null);
    expect(stub.withArgs(client, 1).calledOnce).toEqual(true);
  });
});
