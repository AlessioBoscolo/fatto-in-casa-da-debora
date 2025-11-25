const express = require('express');
const router = express.Router();
const menuController = require('../../controllers/incucinacondebora/menuController');

// Routes
router.get('/getWeekDay', menuController.getWeekDay);
router.get('/getDayMoment', menuController.getDayMoment);
router.get('/getAllRecipe', menuController.getAllRecipe);
router.get('/getPeople', menuController.getPeople);
router.get('/getMenu', menuController.getMenu);
router.get('/clearMenu', menuController.clearMenu);
router.get('/getDayConfiguration', menuController.getDayConfiguration);
router.get('/getMenuArchiviati', menuController.getMenuArchiviati);
router.get('/getColors', menuController.getColors);
router.get('/getLastMenu', menuController.getLastMenu);

router.post('/insertMenu', menuController.insertMenu);
router.post('/getDaysElement', menuController.getDaysElement);
router.post('/deleteMenuElement', menuController.deleteMenuElement);
router.post('/updateMenuElement', menuController.updateMenuElement);
router.post('/updateDayConfiguration', menuController.updateDayConfiguration);
router.post('/saveMenu', menuController.saveMenu);
router.post('/getMenuName', menuController.getMenuName);
router.post('/getArchiviedElement', menuController.getArchiviedElement);
router.post('/clearMenuArchivied', menuController.clearMenuArchivied);
router.post('/getMenuArchiviato', menuController.getMenuArchiviato);
router.post('/updateMenuArchiviatoNome', menuController.updateMenuArchiviatoNome);
router.post('/getElementsOfRecipe', menuController.getElementsOfRecipe);
router.post('/uploadMenuArchivied', menuController.uploadMenuArchivied);










module.exports = router;