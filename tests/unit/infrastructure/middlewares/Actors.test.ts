import { NextFunction, Request, Response } from 'express';
import { ClientError } from '../../../../src/infrastructure/error';
import { Actors } from '../../../../src/infrastructure/middlewares';
import { httpCodes } from '../../../../src/infrastructure/httpCodes';

describe('The Actors middleware', () => {
  let reqMock: Request;
  let resMock: Response;
  let nextMock: NextFunction;

  beforeEach(() => {
    resMock = jest.fn() as unknown as Response;
    nextMock = jest.fn((error?: ClientError) => error) as unknown as NextFunction;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call next when the req param matches the pattern', () => {
    reqMock = { params: { id: '1' } } as unknown as Request;

    Actors.checkActorId(reqMock, resMock, nextMock);

    expect(nextMock).toBeCalledTimes(1);
    expect(nextMock).toBeCalledWith();
  });

  it('should call next with error param when the req param doesn\'t matches the pattern', () => {
    reqMock = { params: { id: 'not a digit' } } as unknown as Request;

    Actors.checkActorId(reqMock, resMock, nextMock);

    const details = [{
      context: {
        label: 'value', name: undefined, regex: /^\d+$/, value: 'not a digit',
      },
      message: '"value" with value "not a digit" fails to match the required pattern: /^\\d+$/',
      path: [],
      type: 'string.pattern.base',
    }];
    const message = '"value" with value "not a digit" fails to match the required pattern: /^\\d+$/';
    const error = new ClientError(httpCodes.badRequest, message, details);

    expect(nextMock).toBeCalledTimes(1);
    expect(nextMock).toBeCalledWith(error);
  });
});
