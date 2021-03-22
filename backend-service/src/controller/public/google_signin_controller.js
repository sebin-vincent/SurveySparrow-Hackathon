const Joi = require('joi');
const { OAuth2Client } = require("google-auth-library");
const logger = require('winston');
const config = require('config');

const User = require('../../model/user');

const clientId = config.get('googleClientId');
const authClient = new OAuth2Client(clientId);

const loginRequestSchema = Joi.object({
    tokenId: Joi.string().required(),
});

exports.login = async (req, resp) => {

    let user;
    let tokenId;
    let googleResponse;

    try {
        const requestBody = await loginRequestSchema.validateAsync(req.body);
        tokenId = requestBody.tokenId;
    } catch (ex) {
        const errorMessage = ex.details[0].message;
        logger.error(errorMessage);
        throw ({ httpStatus: 400, message: errorMessage });
    }

    try {
        googleResponse = await authClient.verifyIdToken({
            idToken: tokenId,
            audience: clientId
        });
    } catch (ex) {
        logger.error(ex);
        throw ({ httpStatus: 500, message: "Something went wrong" });
    }

    let payload = googleResponse.getPayload();

    if (payload.email_verified) {

        let email = payload.email;
        user = await User.findOne({ email: email });
        if (user) {
            logger.info(`Request for signin from email ${payload.email}`);

            let accessToken = user.generateAuthToken('accessToken');
            let refreshToken = user.generateAuthToken('refreshToken');
            return resp.send({ accessToken, refreshToken });
        } else {
            logger.info(`Request for signup from email ${payload.email}`);

            const now = new Date().getTime();

            user = new User({
                email: email,
                name: payload.name,
                isEnabled: true,
                isDeleted: false,
                createdOn: now,
                updatedOn: now
            });
            user = await user.save();
            let accessToken = user.generateAuthToken('accessToken');
            let refreshToken = user.generateAuthToken('refreshToken');
            return resp.send({ accessToken, refreshToken });
        }
    } else {
        return resp.status(403).send({ error: "Forbidden" });
    }

}
