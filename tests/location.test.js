
const request = require('supertest');
var app = require('../server');


describe("Location  Test", () => {

  it('Country Positive Test', async () => {
    await request(app)
      .get('/api/sc-countryList/:?name=india')
      .expect(200);
  });

  it('Country Negative Test', async () => {
     await request(app)
      .get('/api/sc-countryList/:?name=xxxx')
      .expect(404);
  });

  it('State Positive Test', async () => {
    await request(app)
      .get('/api/sc-stateList/:?name=kerala')
      .expect(200);
  });

  it('State Negative Test', async () => {
     await request(app)
      .get('/api/sc-stateList/:?name=cccccc')
      .expect(404);
  });
  
  it('City Positive Test', async () => {
    await request(app)
      .get('/api/sc-cityList/:?name=kollam')
      .expect(200);
  });
});
