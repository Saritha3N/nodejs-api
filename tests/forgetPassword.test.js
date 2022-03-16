
const request = require('supertest');
var app = require('../server');

describe("Forget password Positive Test", () => {
  test('Forget password success', async () => {
    const res = await request(app)
      .post('/api/sc-forgotpassword')
      .send({
        email: 'nithin@gmail.com'
      }).expect(200);
  });
  test('Forget password Failed, no such user', async () => {
    const res = await request(app)
      .post('/api/sc-forgotpassword')
      .send({
        email: 'nithinp@gmail.com'
      }).expect(404);
  });
});
