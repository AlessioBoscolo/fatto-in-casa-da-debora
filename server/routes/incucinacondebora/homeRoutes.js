const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/incucinacondebora/homeController');


router.get('/getCategory', homeController.getCategory);

module.exports = router;