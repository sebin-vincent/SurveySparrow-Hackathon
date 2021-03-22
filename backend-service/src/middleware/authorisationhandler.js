const jwt = require('jsonwebtoken');

const authSetup = require('../startup/auth_setup');

let PUBLIC_KEY;

const setupPublicKey = async () => {
    PUBLIC_KEY = await authSetup.readPublicKey();
}

async function authorise(req, resp, next) {

    if (!PUBLIC_KEY)
        await setupPublicKey();

    const token = req.header('x-auth-token');
    if (!token) {
        return resp.status(401).json({ error: 'Access denied. No token provided' });
    }

    try {
        let payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
        if (payload.tokenType === 'refreshToken') {
            return resp.status(401).json({ error: 'Invalid token type' });
        }
        req.user = payload; //Inject user details from token into request header
        next();
    } catch (exception) {
        console.log(exception);
        return resp.status('401').send({ error: "Access denied!" });
    }
}

module.exports = authorise;