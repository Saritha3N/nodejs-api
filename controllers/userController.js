
const userRegistration = require('../src/userRegistration');
const login = require('../src/login');
const fpassword= require('../src/forgotPassword');
const userData= require('../src/userData');

const loginController = async (req, res) => {
    try {
        const loginData = req.body;
        login.loginRequest(loginData, res);
    } catch (error) {
       console.log(error);
    }
};

const createUser = async (req, res) => {
    try {
        const registartionData = req.body;
        if(registartionData) {
            userRegistration.userRegistrationRequest(registartionData, res);
        } else {        
            res.statusCode = 206;
            res.send('Insuffient Input');
        }        
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const forgotpassword = async (req, res) => {
    try {
        fpassword.forgotPasswordRequest(req, res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const listRequest = req.headers['authorization'];
        console.log(listRequest);
        userData.userData(listRequest,res);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    loginController,
    forgotpassword,
    getUser
};