const express = require('express');
const sequelize = require('./config/database');

// Import models
const User = require('./models/User');

// Import routes
const userRoutes = require('./routes/UserRoute');

const app = express();
const PORT = 8585;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/users', userRoutes);

// Sync database
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });