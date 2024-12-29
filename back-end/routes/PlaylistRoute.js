const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/PlaylistController');
const { requireAuth } = require('../middleware/JWTmiddleware');

router.post('/', requireAuth, playlistController.createPlaylist);
router.get('/', requireAuth, playlistController.getUserPlaylists);
router.get('/names', requireAuth, playlistController.getUserPlaylistNames);
router.delete('/:name', requireAuth, playlistController.deletePlaylistByName);
router.delete('/:name/songs/:musicId', requireAuth, playlistController.removeSongFromPlaylist);

module.exports = router;