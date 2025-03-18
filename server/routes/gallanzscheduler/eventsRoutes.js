const express = require('express');
const router = express.Router();
const eventsController = require('../../controllers/gallanzscheduler/eventsController');

// Routes
router.get('/getEvents', eventsController.getEvents);
router.post('/saveEvent', eventsController.saveEvent);
router.post('/deleteEvent', eventsController.deleteEvent);

module.exports = router;