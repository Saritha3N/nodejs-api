const request = require('supertest');
const app = require('../server');

describe("Login", () => {
  
  it('Login success', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'saritha@gmail.com',
        password: 'encsaritha'
      }).expect(200);
  });
  
  it('Login success', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'saritha@gmail.com',
        password: 'encsaritha'
      }).expect(200);
  });

  it('Login Password Is Wrong', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'saritha@gmail.com',
        password: 'encsaritha1'
      }).expect(401);
  });
  it('Login with wrong user name and password', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'sarithawww@gmail.com',
        password: 'encsarithwwwwwa'
      }).expect(206);
  });
});