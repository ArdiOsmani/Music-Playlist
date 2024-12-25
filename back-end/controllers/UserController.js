const { User, Music, Playlist, sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');


exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }


    const newUser = await User.create({ 
      username, 
      password, 
      role: role || 'user' 
    });


    res.status(201).json({ 
      id: newUser.id, 
      username: newUser.username, 
      role: newUser.role 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message 
    });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role']
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'role']
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user', 
      error: error.message 
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role } = req.body;


    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    if (username && username !== user.username) {
      const existingUser = await User.findOne({ 
        where: { 
          username,
          id: { [Op.ne]: id } 
        }
      });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Username already exists' 
        });
      }
    }


    const updates = {};
    if (username) updates.username = username;
    if (role) updates.role = role;

    await user.update(updates);


    res.status(200).json({
      id: user.id,
      username: user.username,
      role: user.role
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      message: 'Error updating user',
      error: error.message 
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;


    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    const transaction = await sequelize.transaction();

    try {

      await Playlist.destroy({
        where: { user_id: id },
        transaction
      });


      await Music.destroy({
        where: { artist_id: id },
        transaction
      });


      await user.destroy({ transaction });


      await transaction.commit();

      res.status(200).json({ 
        message: 'User and all associated data deleted successfully' 
      });
    } catch (error) {

      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting user', 
      error: error.message 
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;


    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET || 'musicplaylist',
      {
        expiresIn: '1h', 
        issuer: 'MusicPlaylist',
        audience: 'http://localhost:5173'
      }
    );

    res.status(200).json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: `${token}` 
    });
  } catch (error) {
    res.status(500).json({
      message: 'Login error',
      error: error.message
    });
  }
};