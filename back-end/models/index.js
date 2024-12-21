const sequelize = require('../config/database');
const User = require('./User');
const Genre = require('./Genre');
const Music = require('./Music');
const Playlist = require('./Playlist');

const initializeAssociations = () => {

  User.hasMany(Music, { 
    foreignKey: 'artist_id',
    constraints: false 
  });
  Music.belongsTo(User, { 
    foreignKey: 'artist_id',
    as: 'Artist',
    constraints: false 
  });


  Genre.hasMany(Music, { 
    foreignKey: 'genre_id',
    constraints: false 
  });
  Music.belongsTo(Genre, { 
    foreignKey: 'genre_id',
    constraints: false 
  });


  User.hasMany(Playlist, { 
    foreignKey: 'user_id',
    constraints: false 
  });
  Playlist.belongsTo(User, { 
    foreignKey: 'user_id',
    constraints: false 
  });


  Music.hasMany(Playlist, { 
    foreignKey: 'music_id',
    constraints: false 
  });
  Playlist.belongsTo(Music, { 
    foreignKey: 'music_id',
    constraints: false 
  });
};

initializeAssociations();

module.exports = {
  sequelize,
  User,
  Genre,
  Music,
  Playlist
};