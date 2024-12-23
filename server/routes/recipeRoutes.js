const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');


router.post('/getRecipeDetails', recipeController.getRecipeDetails);
router.get('/getIngredients', recipeController.getIngredients);
router.get('/getUoM', recipeController.getUoM);
router.post('/insertRecipe', recipeController.insertRecipe);
router.post('/insertIngredient', recipeController.insertIngredient);
router.post('/saveUpdateRecipe', recipeController.saveUpdateRecipe);
router.post('/search', recipeController.search);




module.exports = router;