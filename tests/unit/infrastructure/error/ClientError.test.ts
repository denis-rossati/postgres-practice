import Joi, { ValidationErrorItem } from 'joi';

import { ClientError } from '../../../../src/infrastructure/error';

import { httpCodes } from '../../../../src/infrastructure/httpCodes';

type ValidationError = {
  error: ValidationError;
  message: string;
  details: ValidationErrorItem[];
}

describe('The ClientError', () => {
    it('should return a detailed message error', () => {
        const firstError = Joi.string().required().validate(123) as unknown as ValidationError;
        const secondError = Joi.number().required().validate('foo') as unknown as ValidationError;

        const result = new ClientError(
            httpCodes.badRequest,
            firstError.error.message,
            [...firstError.error.details, ...secondError.error.details],
        );

        const expected = {
            message: '"value" must be a string',
            details: [
                '"value" must be a string',
                '"value" must be a number',
            ],
        };

        expect(result.presentToClient()).toEqual(expected);
    });

    it('should be an empty array when details are undefined', () => {
        const firstError = Joi.string().required().validate(123) as unknown as ValidationError;
        const result = new ClientError(
            httpCodes.badRequest,
            firstError.error.message,
        );

        const expected = {
            message: '"value" must be a string',
            details: [],
        };

        expect(result.presentToClient()).toStrictEqual(expected);
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
