const { Music, User, Genre } = require('../models/index');
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