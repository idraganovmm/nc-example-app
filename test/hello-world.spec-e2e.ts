import request from 'supertest';
import { create as createApp } from './utils/app';

describe('GET /hello-world', () => {
  let app: Express.Application;
  let destroy: () => Promise<void>;

  beforeAll(() => {
    const { app: _app, destroy: _destroy } = createApp();
    app = _app;
    destroy = _destroy;
  });

  afterAll(async () => {
    await destroy();
  });

  it('should return 200 with a message', async () => {
    await request(app).get('/').expect(200, 'Hello, World!');
  });
});
