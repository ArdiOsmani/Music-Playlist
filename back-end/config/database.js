const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('musicplaylist', 'root', '', {
  host: 'localhost',
  port: 3307,
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: true
  }
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Remove the automatic seeding from here
testConnection();

module.exports = sequelize;