const mongoose = require('mongoose');
const config = require('config');
const logger = require('winston');

module.exports.initialize = () => {
    const env = process.env.NODE_ENV;



    logger.info(`Initialising db in ${env} environment`);

    let db = config.get('db');

    if (env === 'production') {

        const dbUser = config.get('dbUser');
        const dbPassword = config.get('dbPassword');

        db = db.replace('[username]', dbUser);
        db = db.replace('[password]', dbPassword);
    } else if (env === 'test') {
        return; //Database should not be initialised for database
    }

    mongoose.connect(db,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
        .then(() => logger.info('connected to mongodb'));
}
