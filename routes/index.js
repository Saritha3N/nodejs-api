// getting routes and mapped to controller
const { Router } = require('express');
const controllers = require('../controllers');
const getcontrollers = require('../controllers/getController');
const router = Router();

router.post('/sc-login', controllers.loginController);
router.post('/sc-register', controllers.createUser);
router.post('/sc-forgotpassword', controllers.forgotpassword);

router.get('/sc-countryList/:', getcontrollers.countryList);
router.get('/sc-stateList/:', getcontrollers.stateList);
router.get('/sc-cityList/:', getcontrollers.cityList);

module.exports = router;