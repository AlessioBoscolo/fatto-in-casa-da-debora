const express = require('express');
const router = express.Router();
const userController = require('../../controllers/incucinacondebora/userController');

// Routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/setUserPermission', userController.setUserPermission);
router.post('/deleteUserRequest', userController.deleteUserRequest);
router.get('/test', userController.test);
router.get('/usersNotAccepted', userController.usersNotAccepted);
router.get('/getUserPermissions', userController.getUserPermissions);
router.get('/getUserAuthorized', userController.getUserAuthorized);



module.exports = router;