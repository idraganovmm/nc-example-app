import request from 'supertest';
import {
  create as createApp,
  expectError,
  getUserCredentials,
  InvalidCredentials,
  registerUser,
  UnprocessableEntity,
} from '../utils';

describe('POST /auth/login', () => {
  let app: Express.Application;
  let destroy: () => Promise<void>;
  const credentials = getUserCredentials();

  beforeAll(() => {
    const { app: _app, destroy: _destroy } = createApp();
    app = _app;
    destroy = _destroy;
  });

  beforeAll(async () => {
    await registerUser(app, credentials);
  });

  afterAll(async () => {
    await destroy();
  });

  describe('given the email and password are valid', () => {
    it('should login the user and return a jwt token', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send(credentials)
        .expect(200);
      expect(typeof res.body.idToken).toBe('string');
    });

    describe('when there are empty credentials', () => {
      it('should return 422', async () => {
        await request(app)
          .post('/auth/login')
          .send({})
          .expect('content-type', /json/)
          .expect(expectError(UnprocessableEntity));
      });
    });

    describe('when the email does not exist in db', () => {
      it('should return 422', async () => {
        const newCredentials = getUserCredentials();
        await request(app)
          .post('/auth/login')
          .send(newCredentials)
          .expect('content-type', /json/)
          .expect(expectError(InvalidCredentials));
      });
    });
  });

  describe('when the password does not match in db', () => {
    it('should return 422', async () => {
      await request(app)
        .post('/auth/login')
        .send({ email: credentials.email, password: 'wrong password' })
        .expect('content-type', /json/)
        .expect(expectError(InvalidCredentials));
    });
  });
});
