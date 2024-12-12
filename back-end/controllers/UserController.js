const User = require('../models/User');


const createUser = async (req, res) => {
  try {
    const { username, password, favoriteMusicGenres } = req.body;
    const user = await User.create({ username, password, favoriteMusicGenres });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, favoriteMusicGenres } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.update({ username, password, favoriteMusicGenres });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
