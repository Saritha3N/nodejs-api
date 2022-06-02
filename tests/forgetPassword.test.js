
const request = require('supertest');
const app = require('../server');

describe("Forget password Positive Test", () => {
  it('Forget password success', async () => {
     await request(app)
      .post('/api/forgotpassword')
      .send({
        email: 'saritha@gmail.com'
      }).expect(200);
  });
  it('Forget password Failed, no such user', async () => {
     await request(app)
      .post('/api/forgotpassword')
      .send({
        email: 'nithinp@gmail.com'
      }).expect(404);
  });
});
