const request = require('supertest');
const app = require('../server');

describe("Register", () => {
    it('Register success', async () => {
        await request(app)
            .post('/api/register')
            .send({
                name: "newtestuser2",
                password: "encnewtestuser2",
                fullname: "newtestuser",
                dob: "1990-07-30",
                email: "newtestuser2@gmail.com",
                role: "admin",
                cityId: "28"
            }).expect(201);
    });
    it('Registraion failed to insert data in db,duo to wrong date format', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                name: "newtestuser",
                password: "encnewtestuser",
                fullname: "newtestuser",
                dob: "1990/07/30",
                email: "newtestuser@gmail.com",
                role: "admin",
                cityId: "28"
            }).expect(406);
    });
    it('User with this email id already exist', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                name: "newtestuser",
                password: "encnewtestuser",
                fullname: "newtestuser",
                dob: "1990-07-30",
                email: "newtestuser@gmail.com",
                role: "admin",
                cityId: "28"
            }).expect(406);
    });
});