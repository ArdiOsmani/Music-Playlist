const { Sequelize } = require('sequelize');
const UserModel = require('./User'); // Path to your User model file

const sequelize = new Sequelize('musicplaylist', 'root', '', {
  host: 'localhost:3307', // Correct the host to match the configuration
  dialect: 'mysql', // Dialect remains the same since it's MySQL
});

const User = UserModel(sequelize);


sequelize.sync()
  .then(() => console.log('Database synchronized'))
  .catch((err) => console.error('Error synchronizing database:', err));


module.exports = {
  sequelize,
  User,
};
