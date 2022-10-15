import Joi, { ValidationErrorItem } from 'joi';
import * as http from 'http';
import { ClientError } from '../../../../src/infrastructure/error/ClientError';
import { httpCodes } from '../../../../src/infrastructure/httpCodes';

interface ValidationError {
    error: ValidationError;
    message: string;
    details: ValidationErrorItem[];
}

describe(' the ClientError class', () => {
  it('should return a detailed message error', () => {
    const firstError = Joi.string().required().validate(123) as unknown as ValidationError;
    const secondError = Joi.number().required().validate('foo') as unknown as ValidationError;

    const result = new ClientError(
      httpCodes.badRequest,
      firstError.error.message,
      [...firstError.error.details, ...secondError.error.details],
    );

    const expected = {
      status: 400,
      message: '"value" must be a string',
      details: [{
        context: {
          label: 'value',
          value: 123,
        },
        message: '"value" must be a string',
        path: [],
        type: 'string.base',
      },
      {
        context: {
          label: 'value',
          value: 'foo',
        },
        message: '"value" must be a number',
        path: [],
        type: 'number.base',
      },
      ],
    };

    expect(result).toEqual(expected);
  });

  it('details should be an empty array when omitted', () => {
    const firstError = Joi.string().required().validate(123) as unknown as ValidationError;
    const result = new ClientError(
      httpCodes.badRequest,
      firstError.error.message,
    );

    const expected = {
      status: 400,
      message: '"value" must be a string',
      details: [],
    };

    expect(result).toEqual(expected);
  });

  it('should return the status when calling getStatus', () => {
    const firstError = Joi.string().required().validate(123) as unknown as ValidationError;
    const status = httpCodes.success;
    const result = new ClientError(
      status,
      firstError.error.message,
    );

    expect(result.getStatus()).toEqual(status);
  });
});
