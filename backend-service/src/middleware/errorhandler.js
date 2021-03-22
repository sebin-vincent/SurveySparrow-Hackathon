const logger = require('winston');

const errorHandler = (error, req, resp, next) => {
    if (error.httpStatus) {
        logger.error(`${error.message} | status: ${error.httpStatus}`);
        resp.status(error.httpStatus).send({ error: error.message });
    } else {
        logger.error(`${error}`);
        resp.status(500).send({ error: "something went wrong...." });
    }
}

module.exports = errorHandler;