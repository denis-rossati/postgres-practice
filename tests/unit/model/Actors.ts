import sinon from 'sinon';
import { Client } from 'pg';
import Actors from '../../../src/model/Actors';

describe('The actor model', () => {
  const sandbox = sinon.createSandbox();
  beforeEach(() => {
    sandbox.restore();
  });

  it('the connection should start before it ends', () => {
    const mockClient = sandbox.mock(Client);
    Actors.getAll(mockClient);
    mockClient.expects('connect').once();
    mockClient.expects('query').once();
    mockClient.expects('end').once();
    mockClient.verify();
  });
});
