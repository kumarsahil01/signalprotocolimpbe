import { sequelize } from './models/index.js';
import app from './app.js'
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT|| 5000;
import {createServer}  from 'http';
import {Server} from 'socket.io';
import {initSocket} from './sockets/chatSocket.js'



//we are going to intiaize socket.io server starting here 
//lets intialize server
const server = createServer(app);
//attach socket.io to server 
export const io = new Server(server, {
  cors:{
    origin:"",
    method:["GET","POST"]
  }
})
//intialize socket
initSocket(io);



sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced successfully');
    server.listen(PORT, () => {
      console.log(`🚀 Server+socket.IO running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database sync failed:', err);
  });