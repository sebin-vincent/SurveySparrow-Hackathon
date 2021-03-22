const express = require('express');
const http = require('http');
const LOGGER = require('winston');
const cors = require('cors');
const socketIO = require('socket.io');

const loggerInitializer = require('./startup/logger_initializr');
const dbInitializer = require('./startup/db_initializr');
const routeInitializer = require('./startup/route_initializr');
const socketController = require('./controller/socket_controller');


const app = express();
process.env.NODE_ENV = app.get('env');
app.use(cors());


loggerInitializer.initialize();

let server = http.createServer(app);
const io = socketIO(server, { cors: { origin: '*' } }); //Initialize websocket
socketController.initialize(io);

dbInitializer.initialize();
routeInitializer.initialize(app);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => LOGGER.info(`Listening on port ${PORT} in ${app.get('env')} environment`));

module.exports = server;




