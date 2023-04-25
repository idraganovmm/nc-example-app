import createError from 'http-errors';
import { DuplicateRecord, RecordNotFound } from '@modules/database';
import { handleError, mapErrors } from './error';

describe('mapErrors', () => {
  it('should return an error handling middleware', () => {
    const middleware = mapErrors({});
    expect(middleware).toBeInstanceOf(Function);
    expect(middleware.length).toBe(4);
  });

  describe('middleware', () => {
    it('should pass the error to next when no mapping for it is provided', () => {
      const middleware = mapErrors({});
      const error = new Error();
      const next = jest.fn();
      middleware(error, {} as never, {} as never, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    it('should map the error and pass it to next when a mapping is provided', () => {
      const middleware = mapErrors({ [RecordNotFound.name]: DuplicateRecord });
      const error = new RecordNotFound('message');
      const next = jest.fn();
      middleware(error, {} as never, {} as never, next);
      expect(next).toHaveBeenCalledWith(
        new DuplicateRecord(new RecordNotFound('message').message)
      );
    });
  });
});

describe('handleError', () => {
  it('should return an error handling middleware', () => {
    const middleware = handleError({} as never);
    expect(middleware).toBeInstanceOf(Function);
    expect(middleware.length).toBe(4);
  });

  describe('middleware', () => {
    const middleware = handleError({} as never);

    describe('when the response headers have been sent', () => {
      it('should call next with the error', () => {
        const error = new Error();
        const next = jest.fn();
        middleware(error, {} as never, { headersSent: true } as never, next);
      });
    });

    describe('when the response headers have not been sent yet', () => {
      describe('and the error is an http-errors error', () => {
        const error = createError.UnprocessableEntity();
        error.errors = [];
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const res = { send, status };

        beforeAll(() => {
          middleware(error, {} as never, res as never, () => undefined);
        });

        it('should set the response status to the error statusCode', () => {
          expect(status).toHaveBeenCalledWith(error.statusCode);
        });

        it('should respond with an object with the error message', () => {
          expect(send).toHaveBeenCalledWith({
            message: error.message,
            errors: error.errors,
          });
        });
      });

      describe('but the error is not an http-errors error', () => {
        const logger = { error: jest.fn() };
        const middleware = handleError(logger as never);
        const error = new Error('message');
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const res = { send, status };

        beforeAll(() => {
          middleware(error, {} as never, res as never, () => undefined);
        });

        it('should log the error', () => {
          expect(logger.error).toHaveBeenCalledWith(error);
        });

        it('should respond with a 500 error with a predefined message', () => {
          expect(send).toHaveBeenCalledWith({
            message: 'Internal Server Error',
          });
        });
      });
    });
  });
});
