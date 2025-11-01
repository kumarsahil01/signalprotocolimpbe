import { sequelize } from './models/index.js';
import app from './app.js'
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT|| 5000;


sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database sync failed:', err);
  });