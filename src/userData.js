const lib = require('./config/config');
const user = require('./dataProcess');
const db = require("../database/models");

async function userData(requestToken, res) {

    if (requestToken) {
        const bearer = requestToken.split(' ');
        const token = bearer[1];
        lib.jwt.verify(token, process.env.JWTSECRETKEY, (err, authorizedData) => {
            if(err){
                //If error send Forbidden (403)
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
                //If token is successfully verified, we can send the autorized data 
                res.json({
                    message: 'Successful log in',
                    authorizedData
                });
                console.log('SUCCESS: Connected to protected route');
            }
        })
    } else {        
        res.sendStatus(403);
    }
}
module.exports = {
    userData
};