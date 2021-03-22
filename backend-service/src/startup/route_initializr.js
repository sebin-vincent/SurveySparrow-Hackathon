const express = require('express');
const logger = require('winston');

const asyncHandler = require('../middleware/asynchandler');
const errorHandler = require('../middleware/errorhandler');
const googleSignin = require('../controller/public/google_signin_controller');
const collectionRoutes = require('../routes/collection_routes');
const kahootRoutes = require('../routes/kahoot_routes');
const gameRoutes = require('../routes/game_routes');


//Initiase all routes (public and private)
exports.initialize = (app) => {
    logger.info('Initialising application routes.')
    app.use(express.json());

    //public apis
    app.get('/', asyncHandler(async (req, resp) => resp.send({ health: true, active: true })));
    app.post('/google-signin', asyncHandler(googleSignin.login));

    //Secured apis
    app.use('/api/:version/collections', collectionRoutes);
    app.use('/api/:version/kahoots', kahootRoutes);
    app.use('/api/:version/games', gameRoutes);

    app.use(errorHandler);
    logger.info('Application routes initialised.')
}