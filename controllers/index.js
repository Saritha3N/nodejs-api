
const userRegistration = require('../src/userRegistration');
const login = require('../src/login');
const fpassword= require('../src/forgotPassword');

const loginController = async (req, res) => {
    try {
        const loginData = req.body;
        console.log(loginData)
        login.loginRequest(loginData, res);
    } catch (error) {
       console.log(error);
    }
};

const createUser = async (req, res) => {
    try {
        const registartionData = req.body;
        userRegistration.userRegistrationRequest(registartionData, res);
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

module.exports = {
    createUser,
    loginController,
    forgotpassword
};