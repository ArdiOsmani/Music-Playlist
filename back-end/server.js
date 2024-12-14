const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const User = require('./models/User');
const userRoutes = require('./routes/UserRoute');
const app = express();
const PORT = process.env.PORT || 8585;




const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/users', userRoutes);



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