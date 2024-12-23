const { Music, User, Genre } = require('../models/index');
const { Op } = require('sequelize');

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