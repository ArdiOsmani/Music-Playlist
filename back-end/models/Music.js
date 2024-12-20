// models/music.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Music = sequelize.define('Music', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {  // Add this new field
    type: DataTypes.STRING,
    allowNull: false
  },
  youtube_link: {
    type: DataTypes.STRING,
    allowNull: false
  },
  artist_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  genre_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Music;