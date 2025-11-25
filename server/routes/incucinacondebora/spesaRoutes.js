const express = require('express');
const router = express.Router();
const spesaController = require('../../controllers/incucinacondebora/spesaController');


router.get('/getMenuAnalysis', spesaController.getMenuAnalysis);

module.exports = router;