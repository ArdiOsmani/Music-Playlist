const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const newUser = await User.create({ 
      username, 
      password, 
      role: role || 'user' 
    });

    // Return user without password
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
    const { username, password, role } = req.body;

    // Find the user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (username) user.username = username;
    
    // Only hash and update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    
    if (role) user.role = role;

    // Save updated user
    await user.save();

    // Return updated user without password
    res.status(200).json({ 
      id: user.id, 
      username: user.username, 
      role: user.role 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating user', 
      error: error.message 
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
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