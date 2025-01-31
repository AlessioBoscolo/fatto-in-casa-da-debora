const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Routes
router.get('/getWeekDay', menuController.getWeekDay);
router.get('/getDayMoment', menuController.getDayMoment);
router.get('/getAllRecipe', menuController.getAllRecipe);
router.get('/getPeople', menuController.getPeople);
router.get('/getMenu', menuController.getMenu);
router.get('/clearMenu', menuController.clearMenu);
router.get('/getDayConfiguration', menuController.getDayConfiguration);

router.post('/insertMenu', menuController.insertMenu);

module.exports = router;