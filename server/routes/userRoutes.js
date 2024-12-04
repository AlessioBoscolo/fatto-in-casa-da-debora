const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.get('/test', userController.test);

module.exports = router;