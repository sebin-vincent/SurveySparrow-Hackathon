const collectionController = require('../../controller/collection_controller');
const logInistializer = require('../../startup/logger_initializr');

describe('createCollection', () => {
    logInistializer.initialize();

    // it('Should create a contest', async (done) => {
    //     let req = {
    //         body: {
    //             title: "Independence Day Collection",
    //             description: "Collection of questions related to Independence Day"
    //         },
    //         user: {
    //             id: "5f684e30cb92acde514be75e",
    //         }
    //     };
    //     let res = {};
    //     await collectionController.createCollection(req, res);
    //     expect(res.status).toBe(201);
    //     expect(res.body.title).toBe(req.body.title);
    //     expect(res.body.description).toBe(req.body.description);
    //     done();
    // });

    it('Should throw error if title is empty', async (done) => {
        let req = {
            body: {
                description: "Collection of questions related to Independence Day"
            },
            user: {
                id: "5f684e30cb92acde514be75e",
            }
        };
        let res = {};
        try {
            await collectionController.createCollection(req, res);
        } catch (ex) {
            expect(ex.httpStatus).toBe(400);
            expect(ex.message).toContain('title');
            done();
        }
    });

    it('Should throw error if title is not a string', async (done) => {
        let req = {
            body: {
                title: 100,
                description: "Collection of questions related to Independence Day"
            },
            user: {
                id: "5f684e30cb92acde514be75e",
            }
        };
        let res = {};
        try {
            await collectionController.createCollection(req, res);
        } catch (ex) {
            expect(ex.httpStatus).toBe(400);
            expect(ex.message).toContain('title');
            done();
        }
    });

    it('Should throw error if description is not a string', async (done) => {
        let req = {
            body: {
                title: "Independence Day Collection",
                description: 100
            },
            user: {
                id: "5f684e30cb92acde514be75e",
            }
        };
        let res = {};
        try {
            await collectionController.createCollection(req, res);
        } catch (ex) {
            expect(ex.httpStatus).toBe(400);
            expect(ex.message).toContain('description');
            done();
        }
    });
});