const express = require('express');
const homeController = require('../controllers/home');

const router = express.Router();
router.get('/', homeController.getLanding);

router.get('/index', homeController.getIndex);

// should be in last
router.use('/', homeController.getError404);

module.exports = router;
