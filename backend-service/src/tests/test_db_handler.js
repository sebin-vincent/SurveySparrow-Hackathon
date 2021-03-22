const mongoose = require('mongoose');
const config = require('config');
const logger = require('winston');

module.exports.connect = () => {
    const env = process.env.NODE_ENV;
    logger.info(`Initialising db in ${env} environment`);

    let db = config.get('db');

    // const dbUser = config.get('dbUser');
    // const dbPassword = config.get('dbPassword');

    // db = db.replace('[username]', dbUser);
    // db = db.replace('[password]', dbPassword);

    mongoose.connect(db,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
        .then(() => logger.info('connected to mongodb'));
}

module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
}

module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}