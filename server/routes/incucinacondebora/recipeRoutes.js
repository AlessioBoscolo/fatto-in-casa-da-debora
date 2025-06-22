const express = require('express');
const router = express.Router();
const recipeController = require('../../controllers/incucinacondebora/recipeController');


router.post('/getRecipeDetails', recipeController.getRecipeDetails);
router.get('/getIngredients', recipeController.getIngredients);
router.get('/getUoM', recipeController.getUoM);
router.post('/insertRecipe', recipeController.insertRecipe);
router.post('/insertIngredient', recipeController.insertIngredient);
router.post('/insertUoM', recipeController.insertUoM);
router.post('/saveUpdateRecipe', recipeController.saveUpdateRecipe);
router.post('/deleteRecipe', recipeController.deleteRecipe);
router.post('/search', recipeController.search);
router.post('/searchCategory', recipeController.searchCategory);




module.exports = router;