// getting routes and mapped to controller
const { Router } = require('express');
const userController = require('../controllers/userController');
const locationController = require('../controllers/locationController');
const router = Router();

router.post('/sc-login', userController.loginController);
router.post('/sc-register', userController.createUser);
router.post('/sc-forgotpassword', userController.forgotpassword);

router.get('/sc-countryList/:', locationController.countryList);
router.get('/sc-stateList/:', locationController.stateList);
router.get('/sc-cityList/:', locationController.cityList);
router.get('/sc-user/', userController.getUser);

module.exports = router;
