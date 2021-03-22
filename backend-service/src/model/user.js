const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authSetup = require('../startup/auth_setup');
const config = require('config');


let PRIVATE_KEY;

const tokenExpiryTime = config.get('token-expiry-time')

const setupPrivateKey = async () => {
    PRIVATE_KEY = await authSetup.readPrivateKey();
}

setupPrivateKey();

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/]
    },
    isEnabled: { type: Boolean, default: true, required: true },
    isDeleted: { type: Boolean, default: false, required: true },
    createdOn: { type: Date, default: Date.now, required: true },
    updatedOn: { type: Date, required: true }
});

userSchema.methods.generateAuthToken = function (tokenType) {
    let token = jwt.sign({ id: this._id, tokenType }, PRIVATE_KEY,
        {
            algorithm: 'RS256',
            expiresIn: tokenExpiryTime
        })
    return token;
}

const User = mongoose.model('user', userSchema);

module.exports = User;