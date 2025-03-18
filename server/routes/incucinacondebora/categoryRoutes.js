const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/incucinacondebora/categoryController');


router.post('/getRecipe', categoryController.getRecipe);
router.post('/getRandomRecipe', categoryController.getRandomRecipe);
router.post('/getNameCategory', categoryController.getNameCategory);

module.exports = router;