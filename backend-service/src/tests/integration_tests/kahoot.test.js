const request = require('supertest');

const dbHandler = require('../test_db_handler');
const Collection = require('../../model/collection');
const User = require('../../model/user');
const Kahoot = require('../../model/kahoot');

let server;


describe('/api/v1/kahoots', () => {

    beforeAll(async () => {
        await dbHandler.connect();

    });

    afterAll(async () => await dbHandler.closeDatabase());


    beforeEach(() => { server = require('../../index'); });

    afterEach(async () => {
        server.close();
        await dbHandler.clearDatabase();
    });

    describe('POST /draft Draft new kahoot', () => {

        it('Should return status 401 if collection creation request fired with in-valid token', async () => {

            let accessToken = 'sample invalid access token';

            let requestBody = {
                title: "Kahoot Title",
                description: "Some description"
            };

            const response = await request(server).post('/api/v1/kahoots/draft/')
                .set('x-auth-token', accessToken).send(requestBody);

            expect(response.status).toBe(401);


        });

        it('Should return status 201 if kahoot created with valid arguments', async () => {

            let user = new User({
                email: "dummy@mail.com",
                isEnabled: true,
                isDeleted: false,
                createdOn: new Date(),
                updatedOn: new Date()
            });

            await user.save();

            let accessToken = user.generateAuthToken('accessToken');


            let requestBody = {
                title: "Kahoot Title",
                description: "Some description"
            };

            const response = await request(server).post('/api/v1/kahoots/draft')
                .set('x-auth-token', accessToken).send(requestBody);

            expect(response.status).toBe(201);
            expect(response.body.title).toEqual(requestBody.title);

        });
    });

    describe('GET / get all kahoots', () => {

        it('Should return 200 if fired with valid arguments', async () => {

            let user = new User({
                email: "dummy@mail.com",
                isEnabled: true,
                isDeleted: false,
                createdOn: new Date(),
                updatedOn: new Date()
            });

            await user.save();

            let accessToken = user.generateAuthToken('accessToken');

            const collection = new Collection({
                title: 'Title',
                description: 'some description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                enabled: true,
                deleted: false
            });

            await collection.save();

            const kahoots = Kahoot.insertMany([
                {
                    title: 'Title1',
                    description: 'Description1',
                    createdBy: user._id,
                    createdOn: new Date(),
                    updatedBy: user._id,
                    updatedOn: new Date(),
                    questions: [],
                    collectionId: collection._id,
                    deleted: false,
                    ready: true
                }, {
                    title: 'Title2',
                    description: 'Description2',
                    createdBy: user._id,
                    createdOn: new Date(),
                    updatedBy: user._id,
                    updatedOn: new Date(),
                    questions: [],
                    collectionId: collection._id,
                    deleted: false,
                    ready: true
                }
            ]);

            const response = await request(server).get('/api/v1/kahoots')
                .set('x-auth-token', accessToken);

            expect(response.status).toBe(200);
            expect(response.body.length).toBe((await kahoots).length);

        });
    });

    describe('GET /:id get kahoot by Id', () => {
        it('Should return 200 if fired with valid arguments', async () => {

            let user = new User({
                email: "dummy@mail.com",
                isEnabled: true,
                isDeleted: false,
                createdOn: new Date(),
                updatedOn: new Date()
            });

            await user.save();

            let accessToken = user.generateAuthToken('accessToken');

            const collection = new Collection({
                title: 'Title',
                description: 'some description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                enabled: true,
                deleted: false
            });

            await collection.save();

            const kahoot = new Kahoot({

                title: 'Title',
                description: 'Description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                questions: [],
                collectionId: collection._id,
                deleted: false,
                ready: true
            });

            await kahoot.save();

            const response = await request(server).get('/api/v1/kahoots/' + kahoot._id)
                .set('x-auth-token', accessToken);

            expect(response.status).toBe(200);
            expect(response.body.title).toEqual('Title');
        });
    });

    describe('PUT /:id update kahoot', () => {

        it('should return 200 if fired with valid argument || Posetive test case', async () => {

            let user = new User({
                email: "dummy@mail.com",
                isEnabled: true,
                isDeleted: false,
                createdOn: new Date(),
                updatedOn: new Date()
            });

            await user.save();

            let accessToken = user.generateAuthToken('accessToken');

            const collection = new Collection({
                title: 'Title',
                description: 'some description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                enabled: true,
                deleted: false
            });

            await collection.save();

            const kahootId = '6f684d8db2ee3b2e58cc3501';
            const kahoot = new Kahoot({
                _id: kahootId,
                title: 'Initial title',
                description: 'Initial description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                questions: [],
                collectionId: collection._id,
                deleted: false,
                ready: true
            });

            await kahoot.save();

            const requestBody = {
                title: 'Changed title',
                description: 'Changed description'
            };

            const response = await request(server).put('/api/v1/kahoots/' + kahootId)
                .set('x-auth-token', accessToken).send(requestBody);

            let updatedKahoot = await Kahoot.findOne({ _id: kahoot._id });


            expect(response.status).toBe(200);

            expect(response.body.title).toEqual(requestBody.title);
            expect(response.body.description).toEqual(requestBody.description);

            expect(updatedKahoot.title).toEqual(requestBody.title);
            expect(updatedKahoot.description).toEqual(requestBody.description);
        });
    });

    describe('PUT /:id/ready To validate and make kahoot ready to play', () => {
        it('Shoud return 200 if fired with valid arguments', async () => {

            let user = new User({
                email: "dummy@mail.com",
                isEnabled: true,
                isDeleted: false,
                createdOn: new Date(),
                updatedOn: new Date()
            });

            await user.save();

            let accessToken = user.generateAuthToken('accessToken');

            const collection = new Collection({
                title: 'Title',
                description: 'some description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                enabled: true,
                deleted: false
            });

            await collection.save();

            const kahootId = '6f684d8db2ee3b2e58cc3501';
            const IS_READY_FALSE = false;
            const kahoot = new Kahoot({
                _id: kahootId,
                title: 'Initial title',
                description: 'Initial description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                questions: [],
                collectionId: collection._id,
                deleted: false,
                ready: IS_READY_FALSE
            });
            await kahoot.save();

            const response = await request(server)
                .put(`/api/v1/kahoots/${kahoot._id}/ready`)
                .set('x-auth-token', accessToken);

            const newKahootState = await Kahoot.findOne({ _id: kahoot._id });

            expect(response.status).toBe(200);
            expect(newKahootState.ready).toBeTruthy();
        });
    });

    describe('POST /:id/collection/:id To add kahoot to a collection', () => {

        it(`Should return status 200 if fired with valid arguments`, async () => {

            let user = new User({
                email: "dummy@mail.com",
                isEnabled: true,
                isDeleted: false,
                createdOn: new Date(),
                updatedOn: new Date()
            });

            await user.save();

            let accessToken = user.generateAuthToken('accessToken');

            const collection = new Collection({
                title: 'Title',
                description: 'some description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                enabled: true,
                deleted: false
            });

            await collection.save();

            const kahoot = new Kahoot({
                title: 'Initial title',
                description: 'Initial description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                questions: [],
                deleted: false,
                ready: true
            });

            await kahoot.save();

            const response = await request(server)
                .post(`/api/v1/kahoots/${kahoot._id}/collection/${collection._id}`)
                .set('x-auth-token', accessToken);

            const updatedKahoot = await Kahoot.findOne({ _id: kahoot._id });

            expect(response.status).toBe(200);
            // expect(response.body.collectionId).toBe(collection._id);

            // expect(updatedKahoot._id).toEqual(collection._id);
        });
    });

    describe('PUT /:id delete kahoot', () => {

        it('Should return 200 if fired with valid arguments', async () => {
            let user = new User({
                email: "dummy@mail.com",
                isEnabled: true,
                isDeleted: false,
                createdOn: new Date(),
                updatedOn: new Date()
            });

            await user.save();

            let accessToken = user.generateAuthToken('accessToken');

            const collection = new Collection({
                title: 'Title',
                description: 'some description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                enabled: true,
                deleted: false
            });

            await collection.save();

            const kahootId = '6f684d8db2ee3b2e58cc3501';
            const kahoot = new Kahoot({
                _id: kahootId,
                title: 'Initial title',
                description: 'Initial description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                questions: [],
                collectionId: collection._id,
                deleted: false,
                ready: true
            });

            await kahoot.save();

            let response = await request(server).delete('/api/v1/kahoots/' + kahootId)
                .set('x-auth-token', accessToken);

            const newKahootState = await Kahoot.findOne({ _id: kahootId });
            let isKahootDeleted = newKahootState.deleted;

            expect(response.status).toBe(200);
            expect(isKahootDeleted).toBeTruthy();

        });
    });


    describe('POST /:id/questions', () => {

        it('Should return 201 if fired with valid inputs', async () => {

            let user = new User({
                email: "dummy@mail.com",
                isEnabled: true,
                isDeleted: false,
                createdOn: new Date(),
                updatedOn: new Date()
            });

            await user.save();

            let accessToken = user.generateAuthToken('accessToken');


            const kahoot = new Kahoot({
                title: 'Initial title',
                description: 'Initial description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                questions: [],
                deleted: false,
                ready: true
            });

            await kahoot.save();

            const requestBody = {
                questionNumber: 1,
                choices: [{
                    answer: "Sebin",
                    correct: true
                }, {
                    answer: "Shaheer",
                    correct: false
                },
                {
                    answer: "Benin",
                    correct: false
                }, {
                    answer: "Soumya",
                    correct: false
                }],
                points: true,
                pointsMultiplier: 2,
                question: "What is your name",
                time: 20,
                type: 'MCQ'
            }

            const response = await request(server).post(`/api/v1/kahoots/${kahoot._id}/questions`)
                .set('x-auth-token', accessToken).send(requestBody);

            expect(response.status).toBe(200);
            expect(response.body.questions.length).toBe(1);
        });
    });

    describe('DELETE /:kahootId/questions/:questionId to delete question', () => {

        it('Should return 200 if fired with valid inputs', async () => {

            let user = new User({
                email: "dummy@mail.com",
                isEnabled: true,
                isDeleted: false,
                createdOn: new Date(),
                updatedOn: new Date()
            });

            await user.save();

            let accessToken = user.generateAuthToken('accessToken');


            const kahoot = new Kahoot({
                title: 'Initial title',
                description: 'Initial description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                questions: [
                    {
                        questionNumber: 1,
                        question: "What is your name?",
                        choices: [{
                            answer: "Sebin",
                            correct: true
                        }, {
                            answer: "Shaheer",
                            correct: false
                        },
                        {
                            answer: "Benin",
                            correct: false
                        }, {
                            answer: "Soumya",
                            correct: false
                        }],
                        points: true,
                        pointsMultiplier: 2,
                        time: 30,
                        type: 'MCQ',
                        createdOn: new Date(),
                        updatedOn: new Date(),
                    }
                ],
                deleted: false,
                ready: true
            });

            await kahoot.save();

            let questionId = kahoot.questions[0]._id;

            const response = await request(server).delete(`/api/v1/kahoots/${kahoot._id}/questions/${questionId}`)
                .set('x-auth-token', accessToken);

            expect(response.status).toBe(200);
            expect(response.body.questions.length).toBe(0);
        });
    });

    describe('POST /:kahootId/questions/:questionId to update question', () => {

        it('Should return 200 if fired with valid inputs', async () => {

            let user = new User({
                email: "dummy@mail.com",
                isEnabled: true,
                isDeleted: false,
                createdOn: new Date(),
                updatedOn: new Date()
            });

            await user.save();

            let accessToken = user.generateAuthToken('accessToken');


            const kahoot = new Kahoot({
                title: 'Initial title',
                description: 'Initial description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                questions: [
                    {
                        questionNumber: 1,
                        question: "What is your name?",
                        choices: [{
                            answer: "Sebin",
                            correct: true
                        }, {
                            answer: "Shaheer",
                            correct: false
                        },
                        {
                            answer: "Benin",
                            correct: false
                        }, {
                            answer: "Soumya",
                            correct: false
                        }],
                        points: true,
                        pointsMultiplier: 2,
                        time: 30,
                        type: 'MCQ',
                        createdOn: new Date(),
                        updatedOn: new Date(),
                    }
                ],
                deleted: false,
                ready: true
            });

            await kahoot.save();

            let questionId = kahoot.questions[0]._id;

            const requestBody = {
                questionNumber: 1,
                choices: [{
                    answer: "Sebin",
                    correct: true
                }, {
                    answer: "Shaheer",
                    correct: false
                },
                {
                    answer: "Benin",
                    correct: false
                }, {
                    answer: "Soumya",
                    correct: false
                }],
                points: true,
                pointsMultiplier: 2,
                question: "Changed Question?",
                time: 20,
                type: 'MCQ'
            }

            const response = await request(server).post(`/api/v1/kahoots/${kahoot._id}/questions/${questionId}`)
                .set('x-auth-token', accessToken).send(requestBody);

            console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.questions[0].question).toEqual('Changed Question?');
        });
    });
});