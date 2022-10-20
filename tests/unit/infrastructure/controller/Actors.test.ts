import { Request, Response } from 'express';
import { Actors } from '../../../../src/infrastructure/controller';
import { Actors as ActorsService } from '../../../../src/domain/service';
import { connection } from '../../../../src/model/connection';

afterAll(() => {
  connection.end();
});

describe('The Actors controller', () => {
  describe('getAll', () => {
    let reqMock: Request;
    let resMock: Response;

    let resProps: any;

    beforeEach(() => {
      reqMock = jest.fn() as unknown as Request;

      resProps = {
        json: jest.fn(),
        status: jest.fn(),
      };

      resMock = {
        json: jest.fn(() => resProps),
        status: jest.fn(() => resProps),
      } as unknown as Response;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should call the actors service', async () => {
      const spy = jest.spyOn(ActorsService, 'getAll');

      await Actors.getAll(reqMock, resMock);

      expect(spy).toBeCalledTimes(1);
    });

    it('should return code 500 and error message if the service response is null', async () => {
      jest.spyOn(ActorsService, 'getAll').mockReturnValueOnce(Promise.resolve(null));

      await Actors.getAll(reqMock, resMock);

      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.status).toBeCalledWith(500);

      expect(resProps.json).toBeCalledTimes(1);
      expect(resProps.json).toBeCalledWith({ message: 'Our bad. Internal server error' });
    });

    it('should return code 200 and the actors if the service response is a success', async () => {
      const mockData = [
        { id: 1, first_name: 'PETER', last_name: 'BERKMAN' },
        { id: 2, first_name: 'JAMES', last_name: 'DEVITO' },
        { id: 3, first_name: 'LUKES', last_name: 'SILAS' },
      ];

      jest.spyOn(ActorsService, 'getAll').mockReturnValueOnce(Promise.resolve(mockData));

      await Actors.getAll(reqMock, resMock);

      const result = { payload: mockData };

      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.status).toBeCalledWith(200);

      expect(resProps.json).toBeCalledTimes(1);
      expect(resProps.json).toBeCalledWith(result);
    });
  });

  describe('getById', () => {
    let reqMock: Request;
    let resMock: Response;

    let resProps: any;

    beforeEach(() => {
      reqMock = {
        params: { id: 1 },
      } as unknown as Request;

      resProps = {
        json: jest.fn(),
        status: jest.fn(),
      };

      resMock = {
        json: jest.fn(() => resProps),
        status: jest.fn(() => resProps),
      } as unknown as Response;
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should call the actors service using the id', async () => {
      const spy = jest.spyOn(ActorsService, 'getById');

      await Actors.getById(reqMock, resMock);

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(1);
    });

    it('should return code 500 and error message if the service response is null', async () => {
      jest.spyOn(ActorsService, 'getById').mockReturnValueOnce(Promise.resolve(null));

      await Actors.getById(reqMock, resMock);

      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.status).toBeCalledWith(500);

      expect(resProps.json).toBeCalledTimes(1);
      expect(resProps.json).toBeCalledWith({ message: 'Our bad. Internal server error' });
    });

    it('should return code 204 and no actor if the service response is empty', async () => {
      jest.spyOn(ActorsService, 'getById').mockReturnValueOnce(Promise.resolve({ actor: {} }));

      await Actors.getById(reqMock, resMock);

      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.status).toBeCalledWith(204);

      expect(resProps.json).not.toBeCalled();
    });

    it('should return code 204 if the response returns a object whose number of keys are greater than 3', async () => {
      const mockData = {
        actor: {
          one: '', two: '', three: '', four: '',
        },
      };

      jest.spyOn(ActorsService, 'getById').mockReturnValueOnce(Promise.resolve(mockData));

      await Actors.getById(reqMock, resMock);

      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.status).toBeCalledWith(204);

      expect(resProps.json).not.toBeCalled();
    });

    it('should return code 204 if the response returns a object whose number of keys are lesser than 3', async () => {
      const mockData = {
        actor: {
          one: '', two: '',
        },
      };

      jest.spyOn(ActorsService, 'getById').mockReturnValueOnce(Promise.resolve(mockData));

      await Actors.getById(reqMock, resMock);

      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.status).toBeCalledWith(204);

      expect(resProps.json).not.toBeCalled();
    });

    it('should return code 200 and the actors if the service response is a success', async () => {
      const mockData = { actor: { id: 1, first_name: 'PETER', last_name: 'BERKMAN' } };

      jest.spyOn(ActorsService, 'getById').mockReturnValueOnce(Promise.resolve(mockData));

      await Actors.getById(reqMock, resMock);

      expect(resMock.status).toBeCalledTimes(1);
      expect(resMock.status).toBeCalledWith(200);

      expect(resProps.json).toBeCalledTimes(1);
      const response = { payload: mockData };
      expect(resProps.json).toBeCalledWith(response);
    });
  });
});
