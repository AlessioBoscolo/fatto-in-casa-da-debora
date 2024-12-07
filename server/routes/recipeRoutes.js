const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');


router.post('/getRecipeDetails', recipeController.getRecipeDetails);

module.exports = router;