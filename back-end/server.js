const express = require('express');
const userRoutes = require('./routes/UserRoute'); // Correct path to your routes
const { sequelize } = require('./models/index'); // Import Sequelize instance for database connection

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// API routes
app.use('/api', userRoutes);

// Test the database connection
sequelize.authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => console.error('Error connecting to the database:', err));

// Basic health-check route (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handling middleware (optional, for debugging)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
const PORT = 8585;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
