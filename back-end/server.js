const express = require('express');
const passport = require('./config/passportJWT');
const { sequelize } = require('./models'); // Update this line
const cors = require('cors');
const userRoutes = require('./routes/UserRoute');
const musicRoutes = require('./routes/MusicRoute');
const seedDatabase = require('./config/seed');
const app = express();
const PORT = process.env.PORT || 8585;

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(passport.initialize());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/music', musicRoutes);

// Initialize database
sequelize.sync({ force: true })
  .then(async () => {
    console.log('Database synced');
    try {
      await seedDatabase();
      console.log('Database seeded');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});