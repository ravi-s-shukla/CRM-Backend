import 'dotenv/config';
import http from 'http';
import connectDB from './src/config/db.js';
import app from './src/app.js';
import setupSocketIO from './src/socket/index.js';

connectDB();

const server = http.createServer(app);
const io = setupSocketIO(server);
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
