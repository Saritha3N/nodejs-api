
const request = require('supertest');
var app = require('../server');


describe("Location  Test", () => {

  it('Country Positive Test', async () => {
    await request(app)
      .get('/api/country/india')
      .expect(200);
  });

  it('Country Negative Test', async () => {
     await request(app)
      .get('/api/country/abc')
      .expect(200);
  });

  it('State Positive Test', async () => {
    await request(app)
      .get('/api/state/')
      .expect(200);
  });

  it('State Negative Test', async () => {
     await request(app)
      .get('/api/country/abc/state/')
      .expect(404);
  });
  
  it('City Positive Test', async () => {
    await request(app)
      .get('/api/state/kerala/city/')
      .expect(200);
  });
});
