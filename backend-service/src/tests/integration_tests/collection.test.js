const request = require('supertest');

const dbHandler = require('../test_db_handler');
const Collection = require('../../model/collection');
const User = require('../../model/user')

let server;

let userId = '6f684d8db2ee3b2e58cc3501';



describe('/api/v1/collections', () => {

    beforeAll(async () => {
        await dbHandler.connect();

    });

    afterAll(async () => await dbHandler.closeDatabase());


    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => {
        server.close();
        await dbHandler.clearDatabase();
    });

    describe('POST / create new collection', () => {

        it('Should return 401 if collection creation request fired with in-valid token', async () => {

            let accessToken = 'sample invalid access token';

            let requestBody = {
                title: "Kahoot Title",
                description: "Some description"
            };

            const response = await request(server).post('/api/v1/collections')
                .set('x-auth-token', accessToken).send(requestBody);

            expect(response.status).toBe(401);


        });

        it('Shoudl return 201 if collection was created properly', async () => {

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
            }

            const response = await request(server).post('/api/v1/collections')
                .set('x-auth-token', accessToken).send(requestBody);

            expect(response.status).toBe(201);

        });
    });

    describe('GET /:id get collection by id', () => {

        it('Should return 200 if called properly || posetive case', async () => {

            let user = new User({
                email: "dummy@mail.com",
                isEnabled: true,
                isDeleted: false,
                createdOn: new Date(),
                updatedOn: new Date()
            });

            await user.save();

            let accessToken = user.generateAuthToken('accessToken');

            const contestId = '5f684e30cb92acde514be75e';
            const collection = new Collection({
                _id: contestId,
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

            const response = await request(server).get('/api/v1/collections/' + contestId)
                .set('x-auth-token', accessToken);

            expect(response.status).toBe(200);
            expect(response.body.title).toEqual(collection.title);
        });

    });


    describe('GET / get all collections', () => {

        it('Should return 200 if called properly || posetive case', async () => {

            let user = new User({
                email: "dummy@mail.com",
                isEnabled: true,
                isDeleted: false,
                createdOn: new Date(),
                updatedOn: new Date()
            });

            await user.save();

            let accessToken = user.generateAuthToken('accessToken');


            let collections = await Collection.insertMany([
                {
                    title: 'Title-1',
                    description: 'some description-1',
                    createdBy: user._id,
                    createdOn: new Date(),
                    updatedBy: user._id,
                    updatedOn: new Date(),
                    enabled: true,
                    deleted: false
                },
                {
                    title: 'Title-2',
                    description: 'some description-2',
                    createdBy: user._id,
                    createdOn: new Date(),
                    updatedBy: user._id,
                    updatedOn: new Date(),
                    enabled: true,
                    deleted: false
                }

            ]);

            const response = await request(server).get('/api/v1/collections')
                .set('x-auth-token', accessToken);

            expect(response.status).toBe(200); //Test for response status
            expect(response.body.length).toEqual(collections.length); //Test number if collection match
        });

    });

    describe('PUT /:id update a collection', () => {

        it('Should return status 200 with updated collection result for valid input', async () => {

            let user = new User({
                email: "dummy@mail.com",
                isEnabled: true,
                isDeleted: false,
                createdOn: new Date(),
                updatedOn: new Date()
            });

            await user.save();

            let accessToken = user.generateAuthToken('accessToken');

            const contestId = '5f684e30cb92acde514be75e';

            const collection = new Collection({
                _id: contestId,
                title: 'Title',
                description: 'some description',
                createdBy: user._id,
                createdOn: new Date(),
                updatedBy: user._id,
                updatedOn: new Date(),
                enabled: true,
                deleted: false
            });
            await collection.save(); //save collection to mock existing colection

            const ChangedTitle = "Changed title";
            const changeddDescription = "Changed description";

            const requestBody = {
                title: ChangedTitle,
                description: changeddDescription
            };

            const response = await request(server).put('/api/v1/collections/' + contestId)
                .set('x-auth-token', accessToken).send(requestBody);

            let updatedCollection = await Collection.findOne({ createdBy: user._id });

            expect(response.status).toBe(200);

            expect(response.body.title).toEqual(ChangedTitle);
            expect(response.body.description).toEqual(changeddDescription);

            expect(updatedCollection.title).toEqual(ChangedTitle);
            expect(updatedCollection.description).toEqual(changeddDescription);

        });

    });
});