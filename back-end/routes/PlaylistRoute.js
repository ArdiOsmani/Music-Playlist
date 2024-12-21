const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/PlaylistController');
const { requireAuth } = require('../middleware/JWTmiddleware');

router.post('/', requireAuth, playlistController.createPlaylist);
router.get('/', requireAuth, playlistController.getUserPlaylists);

module.exports = router;