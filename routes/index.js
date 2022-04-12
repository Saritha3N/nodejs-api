// getting routes and mapped to controller
const { Router } = require('express');
const userController = require('../controllers/userController');
const locationController = require('../controllers/locationController');
const storeController = require("../controllers/storeController");
const itemController = require("../controllers/itemController");
const orderController = require("../controllers/orderController");
const router = Router();

router.post('/login', userController.loginController);
router.post('/register', userController.createUser);
router.post('/forgotpassword', userController.forgotpassword);

router.get('/user/', userController.getUser);

router.get('/city', locationController.cityList);
router.get('/state/:state/city', locationController.cityList);
router.get('/state_id/:state_id/city', locationController.cityList);
router.get('/country/:country/city', locationController.cityList);
router.get('/country_id/:country_id/city', locationController.cityList);
router.get('/country/:country/state/:state/city', locationController.cityList);

router.get('/state', locationController.stateList);
router.get('/country/:country/state', locationController.stateList);
router.get('/country_id/:country_id/state', locationController.stateList);

router.get('/country', locationController.countryList);
router.get('/country/:name', locationController.countryList);

router.get('/city/:city/stores', storeController.getStores);//get store by city
router.get('/city_id/:id/stores', storeController.getStores);// get store by cityid
router.get('/state/:state/stores', storeController.getStores);//get store by state 
router.get('/state_id/:id/stores', storeController.getStores);// get store by stateid 
router.get('/country/:country/stores', storeController.getStores);//get store by country
router.get('/country_id/:id/stores', storeController.getStores);// get store by countryid


router.get('/store/:store/items', itemController.getItems);// get item by store
router.get('/store_id/:id/items', itemController.getItems);// get item by storeid

router.get('/user/:user/orders', orderController.getOrders);// get order by userid
router.get('/user_id/:id/orders', orderController.getOrders);// get order by userid

module.exports = router;
