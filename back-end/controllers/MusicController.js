const { Music, User, Genre, Playlist, sequelize } = require('../models/index');
const { Op } = require('sequelize');


exports.getUserMusic = async (req, res) => {
    try {
        const userId = req.user.id;
        const music = await Music.findAll({
            where: {
                artist_id: userId
            },
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
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(music);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user music',
            error: error.message
        });
    }
};


exports.createMusic = async (req, res) => {
    try {
        const { name, youtube_link, genre_id } = req.body;
        const artist_id = req.user.id;

        const newMusic = await Music.create({
            name,
            youtube_link,
            artist_id,
            genre_id,
            likes: 0
        });


        const musicWithDetails = await Music.findByPk(newMusic.id, {
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
        });

        res.status(201).json(musicWithDetails);
    } catch (error) {
        res.status(500).json({
            message: 'Error creating music',
            error: error.message
        });
    }
};


exports.deleteMusic = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;


        const music = await Music.findOne({
            where: {
                id: id,
                artist_id: userId
            }
        });

        if (!music) {
            return res.status(404).json({
                message: 'Music not found or unauthorized to delete'
            });
        }


        await music.destroy();

        res.status(200).json({
            message: 'Music deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting music',
            error: error.message
        });
    }
};

exports.getMostLikedMusic = async (req, res) => {
    try {
        const music = await Music.findAll({
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
            ],
            order: [['likes', 'DESC']]
        });
        res.status(200).json(music);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching most liked music',
            error: error.message
        });
    }
};


exports.getNewReleases = async (req, res) => {
    try {
        const music = await Music.findAll({
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
            ],
            order: [['createdAt', 'DESC']],
            limit: 4 
        });
        res.status(200).json(music);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching new releases',
            error: error.message
        });
    }
};


exports.getAllMusic = async (req, res) => {
    try {
        const music = await Music.findAll({
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
        });
        res.status(200).json(music);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching music',
            error: error.message
        });
    }
};

exports.toggleLike = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const userId = req.user.id;


        const music = await Music.findByPk(id, { transaction });
        if (!music) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Music not found' });
        }

        const existingLike = await Playlist.findOne({
            where: {
                user_id: userId,
                music_id: id,
                name: 'Likes'
            },
            transaction
        });

        if (existingLike) {
            await existingLike.destroy({ transaction });
            music.likes = Math.max(0, music.likes - 1);
            await music.save({ transaction });

            await transaction.commit();
            res.json({ 
                liked: false, 
                likes: music.likes 
            });
        } else {
            await Playlist.create({
                name: 'Likes',
                user_id: userId,
                music_id: id
            }, { transaction });

            music.likes = (music.likes || 0) + 1;
            await music.save({ transaction });

            await transaction.commit();
            res.json({ 
                liked: true, 
                likes: music.likes 
            });
        }
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: 'Error toggling like',
            error: error.message
        });
    }
};

exports.getUserLikedSongs = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const likedSongs = await Playlist.findAll({
            where: {
                user_id: userId,
                name: 'Likes'
            },
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

        const songs = likedSongs.map(like => like.Music);
        res.json(songs);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching liked songs',
            error: error.message
        });
    }
};

exports.deletePlaylistByName = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name } = req.params;
        const userId = req.user.id;

        const deletedCount = await Playlist.destroy({
            where: {
                name: name,
                user_id: userId
            },
            transaction
        });

        await transaction.commit();

        if (deletedCount > 0) {
            res.status(200).json({ 
                message: 'Playlist deleted successfully',
                deletedCount
            });
        } else {
            res.status(404).json({ 
                message: 'Playlist not found or already deleted' 
            });
        }
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: 'Error deleting playlist',
            error: error.message
        });
    }
};


exports.removeSongFromPlaylist = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, musicId } = req.params;
        const userId = req.user.id;

        const deletedCount = await Playlist.destroy({
            where: {
                name: name,
                user_id: userId,
                music_id: musicId
            },
            transaction
        });

        await transaction.commit();

        if (deletedCount > 0) {
            res.status(200).json({
                message: 'Song removed from playlist successfully'
            });
        } else {
            res.status(404).json({
                message: 'Song not found in playlist'
            });
        }
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: 'Error removing song from playlist',
            error: error.message
        });
    }
};

exports.updateMusic = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { name, youtube_link, genre_id } = req.body;
        const userId = req.user.id;

        const music = await Music.findOne({
            where: {
                id: id,
                artist_id: userId
            },
            transaction
        });

        if (!music) {
            await transaction.rollback();
            return res.status(404).json({
                message: 'Music not found or unauthorized to update'
            });
        }


        await music.update({
            name: name || music.name,
            youtube_link: youtube_link || music.youtube_link,
            genre_id: genre_id || music.genre_id
        }, { transaction });


        const updatedMusic = await Music.findByPk(music.id, {
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
            ],
            transaction
        });

        await transaction.commit();
        res.status(200).json(updatedMusic);

    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            message: 'Error updating music',
            error: error.message
        });
    }
};