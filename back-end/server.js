const express = require('express');
const userRoutes = require('./routes/UserRoute');
const { sequelize } = require('./models/index');

const app = express();

app.use(express.json());

app.use('/api', userRoutes);

sequelize.authenticate()
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => console.error('Error connecting to the database:', err));


const PORT = 8585;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
