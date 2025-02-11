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
router.get('/getMenuArchiviati', menuController.getMenuArchiviati);

router.post('/insertMenu', menuController.insertMenu);
router.post('/getDaysElement', menuController.getDaysElement);
router.post('/deleteMenuElement', menuController.deleteMenuElement);
router.post('/updateMenuElement', menuController.updateMenuElement);
router.post('/updateDayConfiguration', menuController.updateDayConfiguration);
router.post('/saveMenu', menuController.saveMenu);
router.post('/getMenuName', menuController.getMenuName);
router.post('/getArchiviedElement', menuController.getArchiviedElement);
router.post('/clearMenuArchivied', menuController.clearMenuArchivied);
router.post('/uploadMenuArchivied', menuController.uploadMenuArchivied);







module.exports = router;