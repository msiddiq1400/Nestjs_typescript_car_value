import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles signup request', async () => {
    const email = 'email124@asd.com';
    return request(app.getHttpServer())
      .post('/users/signup')
      .send({
        email,
        password: '455',
      })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signup the user and then return the logged in user', async () => {
    const email = 'asd1124569@gmail.com';
    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send({ email, password: 'pass45' });
    console.log(res);
    const cookie = res.headers['set-cookie'];
    await request(app.getHttpServer())
      .get('/users/session/whoami')
      .set('Cookie', cookie)
      .expect(200);
  });
});
