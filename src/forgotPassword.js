
const dataProcess = require('./dataProcess');
const sql = require("../database/models");

async function forgotPasswordRequest(req, res) {
    if (req.body != null && req.body.email != undefined) {
        var response = await dataProcess.find(sql.User, req.body);
        forgotPasswordHandler(response, res);    
    } else {        
        res.statusCode = 206;
        res.send('Insuffient Input');
    }
}
async function forgotPasswordHandler(response, res) {
    if (response == null) {
        res.statusCode = 404;
        res.send('no such user');
    } else {
        //send mail
        res.statusCode = 200;
        res.send('check mail');
    }
}
module.exports = {
    forgotPasswordRequest
};