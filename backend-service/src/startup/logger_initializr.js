const LOGGER = require('winston');
const { format, transport } = require('winston');
const config = require('config');


exports.initialize = () => {
    const myFormat = format.printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level.toUpperCase()}: ${message}`;
    });

    LOGGER.add(new LOGGER.transports.Console({
        colorise: true,
        prettyPrint: true,
        silent: config.get('isLoggingDisabled'),
        format: format.combine(format.timestamp(), myFormat, format.errors({ stack: true }))
    }));

    LOGGER.info("Logging initialized to console");

    process.on('uncaughtException', error => {
        LOGGER.error('uncaughtException' + error);
        process.exit(1);
    });

    process.on('unhandledRejection', error => {
        LOGGER.error('unhandledRejection :' + error);
        process.exit(1);
    });
}