import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'yourpassword',
    database: process.env.DB_NAME || 'signalchat',
    host: process.env.DB_HOST || 'localhost',
    port :process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions:{
        ssl:{
            require:true,
            rejectUnauthorized: false,
        }
    },
    logging: false,
  },
};
