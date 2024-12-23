const { Playlist, Music, User, Genre } = require('../models');

exports.createPlaylist = async (req, res) => {
    try {
        const { name, songId } = req.body;
        const userId = req.user.id;

        const newPlaylist = await Playlist.create({
            name,
            user_id: userId,
            music_id: songId
        });


        const playlistWithSongs = await Playlist.findOne({
            where: { id: newPlaylist.id },
            include: [{
                model: Music,
                include: [
                    {
                        model: User,
                        as: 'Artist',
                        attributes: ['username']
                    },
                    {
                        model: Genre,
                        attributes: ['name']
                    }
                ]
            }]
        });

        res.status(201).json(playlistWithSongs);
    } catch (error) {
        res.status(500).json({
            message: 'Error creating playlist',
            error: error.message
        });
    }
};

exports.getUserPlaylists = async (req, res) => {
    try {
        const userId = req.user.id;
        const playlists = await Playlist.findAll({
            where: { user_id: userId },
            include: [{
                model: Music,
                include: [
                    {
                        model: User,
                        as: 'Artist',
                        attributes: ['username']
                    },
                    {
                        model: Genre,
                        attributes: ['name']
                    }
                ]
            }]
        });

        // Group songs by playlist name
        const groupedPlaylists = playlists.reduce((acc, playlist) => {
            if (!acc[playlist.name]) {
                acc[playlist.name] = {
                    id: playlist.id,
                    name: playlist.name,
                    songs: []
                };
            }
            if (playlist.Music) {
                acc[playlist.name].songs.push(playlist.Music);
            }
            return acc;
        }, {});

        res.status(200).json(Object.values(groupedPlaylists));
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching playlists',
            error: error.message
        });
    }
};

exports.getUserPlaylistNames = async (req, res) => {
    try {
        const userId = req.user.id;
        const playlists = await Playlist.findAll({
            where: { user_id: userId },
            attributes: ['id', 'name'],
            group: ['name']
        });

        
        const uniquePlaylistNames = [...new Set(playlists.map(playlist => ({
            id: playlist.id,
            name: playlist.name
        })))];

        res.status(200).json(uniquePlaylistNames);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching playlist names',
            error: error.message
        });
    }
};