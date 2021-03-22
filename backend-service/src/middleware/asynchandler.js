const asyncHandler = (handler) => {
    return async (req, resp, next) => {
        try {
            await handler(req, resp);
        } catch (ex) {
            next(ex);
        }
    };
}

module.exports = asyncHandler;