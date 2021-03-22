const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

exports.readPrivateKey = async () => {
    const PRIVATEKEY = await readFile('./private.key', 'utf8');
    return PRIVATEKEY;
}

exports.readPublicKey = async () => {
    const PUBLICKEY = await readFile('./public.key', 'utf8');
    return PUBLICKEY;
}