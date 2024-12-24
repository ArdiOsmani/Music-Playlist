const express = require('express');
const router = express.Router();
const musicController = require('../controllers/MusicController');
const { requireAuth } = require('../middleware/JWTmiddleware');

// Public routes
router.get('/', musicController.getAllMusic);
router.get('/most-liked', musicController.getMostLikedMusic);
router.get('/new-releases', musicController.getNewReleases);

// Protected routes
router.get('/user', requireAuth, musicController.getUserMusic);
router.post('/', requireAuth, musicController.createMusic);
router.delete('/:id', requireAuth, musicController.deleteMusic);

module.exports = router;