// models/playlist.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Playlist = sequelize.define('Playlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  music_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Playlist;