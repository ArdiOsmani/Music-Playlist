const { Music, User, Genre } = require('../models/index');

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