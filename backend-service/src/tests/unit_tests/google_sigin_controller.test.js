const googleSigninController = require('../../controller/public/google_signin_controller');
const { deleteOne } = require('../../model/user');
const logInistializer = require('../../startup/logger_initializr');

describe('login', () => {

    logInistializer.initialize();

    it('should throw error if tokenId is falsy', async (done) => {
        let req = { body: {} };
        let resp = {};

        const falsyValues = [null, undefined, NaN, '', 0, false];

        falsyValues.forEach(async (falsyValue) => {
            req.body.tokenId = falsyValues;
            try {
                await googleSigninController.login(req, resp);
            } catch (ex) {
                expect(ex.httpStatus).toBe(400);
                done();
            }
        });


    });
})