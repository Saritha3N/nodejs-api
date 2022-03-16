const lib = require('./config/config');
const user = require('./dataProcess');
const db = require("../database/models");

async function loginRequest(loginData, res) {
    if (loginData != null && loginData.email != undefined && loginData.password != undefined) {
        const response = await user.find(db.User, { 'email': loginData.email });
        if (response && response.password) {
            const comparison = await lib.bcrypt.compare(loginData.password, response.password);
            if (comparison) {
                delete response.password;
                const token = lib.jwt.sign({
                    username:response
                },
                    process.env.JWTSECRETKEY, {
                    expiresIn: '1d'
                });
                res.status(200).send({                  
                    token
                  });
            } else {
                res.statusCode = 401;
                res.sendStatus = 'Email and password does not match';
                res.send('Email and password does not match');
            }
        } else {
            res.statusCode = 206;
            res.send('Email does not exist');
        }
    } else {
        res.statusCode = 206;
        res.send('Insuffient Input !!');
    }
}
module.exports = {
    loginRequest
};