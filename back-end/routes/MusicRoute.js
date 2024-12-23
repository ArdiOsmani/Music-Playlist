const express = require('express');
const router = express.Router();
const musicController = require('../controllers/MusicController');


router.get('/', musicController.getAllMusic);
router.get('/most-liked', musicController.getMostLikedMusic);
router.get('/new-releases', musicController.getNewReleases);

module.exports = router;