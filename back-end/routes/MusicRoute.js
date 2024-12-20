const express = require('express');
const router = express.Router();
const musicController = require('../controllers/MusicController');

router.get('/', musicController.getAllMusic);

module.exports = router;