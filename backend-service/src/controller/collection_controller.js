const Joi = require('joi');
const mongoose = require('mongoose');
const logger = require('winston');

const Collection = require('../model/collection');
const User = require('../model/user');

const requestSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string()
});

exports.createCollection = async (req, res) => {
    let userId = req.user.id;

    logger.info(`New request received to create a collection | userId: ${userId}`);

    let requestBody;

    logger.info('Validating request to create collection')
    try {
        requestBody = await requestSchema.validateAsync(req.body);
    } catch (ex) {
        logger.error('Error in validating the request for create collection')
        throw ({ httpStatus: 400, message: ex.details[0].message });
    }

    const date = new Date().getTime();

    let collection = new Collection({
        title: requestBody.title,
        description: requestBody.description,
        createdBy: userId,
        createdOn: date,
        updatedBy: userId,
        updatedOn: date
    });

    collection = await collection.save();
    logger.info(`Saved collection to database | collectionId: ${collection._id}`);

    let collectionResponse = {
        id: collection._id,
        title: collection.title,
        description: collection.description
    };
    res.status(201).send(collectionResponse);
};

exports.getCollections = async (req, res) => {
    const userId = req.user.id;

    logger.info(`New request received to get collections | userId: ${userId}`);

    let collectionsResponse;
    let collections = await Collection.find({ enabled: true, deleted: false, createdBy: userId });
    collections = collections && collections.length ? collections : [];
    if (collections.length) {
        logger.info(`Collections obtained | userId: ${userId} | count: ${collections.length}`);
        let collectionsResponsePromise = collections.map(async collection => {
            let user = await User.findById(collection.createdBy);
            let collectionResponse = {
                id: collection._id,
                title: collection.title,
                description: collection.description,
                createdByUserId: collection.createdBy,
                createdByName: user.email,
                createdOn: collection.createdOn,
                modifiedOn: collection.updatedOn,
                kahootsCount: 0, //TODO to query kahoot count and set here
            }
            return collectionResponse;
        });
        collectionsResponse = await Promise.all(collectionsResponsePromise);
    }
    else {
        logger.info(`Collections obtained is empty | userId: ${userId}`);
        collectionsResponse = [];
    }

    res.send(collectionsResponse);
};


exports.getCollectionById = async (req, res) => {
    const userId = req.user.id;

    const collectionId = req.params.id;
    logger.info(`New request received to get collection | collectionId: ${collectionId} | userId: ${userId}`);

    if (!mongoose.isValidObjectId(collectionId))
        throw ({ httpStatus: 400, message: `Invalid collectionId: ${collectionId}` });

    let collection = await Collection.findOne({ _id: collectionId, createdBy: userId });

    if (!collection)
        throw ({ httpStatus: 404, message: `Collection doesn't exist | collectionId: ${collectionId}` });

    if (collection.deleted || !collection.enabled)
        throw ({ httpStatus: 404, message: `Invalid collection | collectionId: ${collectionId}` });

    logger.info(`Collection obtained | collectionId: ${collectionId} | userId: ${userId}`);

    let user = await User.findById(collection.createdBy);

    let collectionResponse = {
        id: collection._id,
        title: collection.title,
        description: collection.description,
        createdByUserId: collection.createdBy,
        createdByName: user.email,
        createdOn: collection.createdOn,
        modifiedOn: collection.updatedOn,
        kahoots: []
    }
    res.send(collectionResponse);
};

exports.updateCollection = async (req, res) => {
    const userId = req.user.id;

    const collectionId = req.params.id;
    logger.info(`New request received to update collection | collectionId: ${collectionId} | userId: ${userId}`);

    if (!mongoose.isValidObjectId(collectionId))
        throw ({ httpStatus: 400, message: `Invalid collectionId: ${collectionId}` });

    let requestBody;

    logger.info('Validating request to update collection')
    try {
        requestBody = await requestSchema.validateAsync(req.body);
    } catch (ex) {
        logger.error('Error in validating the request for create collection')
        throw ({ httpStatus: 400, message: ex.details[0].message });
    }

    let collection = await Collection.findOne({ _id: collectionId });
    if (!collection)
        throw ({ httpStatus: 404, message: `Collection doesn't exist | collectionId: ${collectionId}` });

    if (collection.deleted || !collection.enabled)
        throw ({ httpStatus: 404, message: `Invalid collection | collectionId: ${collectionId}` });

    if (collection.createdBy != userId)
        throw ({ httpStatus: 403, message: `Not authorised to update the collection | collectionId: ${collectionId}` });

    logger.info(`Collection obtained | collectionId: ${collectionId} | userId: ${userId}`);

    collection.title = requestBody.title;
    collection.description = requestBody.description;
    collection.updatedBy = userId;
    collection.updatedOn = new Date().getTime();
    collection = await collection.save();

    logger.info(`Updated collection | collectionId: ${collectionId} | userId: ${userId}`);

    let collectionResponse = {
        id: collection._id,
        title: collection.title,
        description: collection.description
    };
    res.send(collectionResponse);
};

exports.deleteCollection = async (req, res) => {
    const userId = req.user.id;

    const collectionId = req.params.id;
    logger.info(`New request received to delete collection | collectionId: ${collectionId} | userId: ${userId}`);

    if (!mongoose.isValidObjectId(collectionId))
        throw ({ httpStatus: 400, message: `Invalid collectionId: ${collectionId}` });

    let collection = await Collection.findOne({ _id: collectionId, createdBy: userId });

    if (!collection)
        throw ({ httpStatus: 404, message: `Collection doesn't exist | collectionId: ${collectionId}` });

    if (collection.deleted || !collection.enabled)
        throw ({ httpStatus: 404, message: `Invalid collection | collectionId: ${collectionId}` });

    if (collection.createdBy != userId)
        throw ({ httpStatus: 403, message: `Not authorised to update the collection | collectionId: ${collectionId}` });

    logger.info(`Collection obtained | collectionId: ${collectionId} | userId: ${userId}`);

    collection.updatedBy = userId;
    collection.updatedOn = new Date().getTime();
    collection.deleted = true;
    collection = await collection.save();

    logger.info(`Deleted collection | collectionId: ${collectionId} | userId: ${userId}`);

    res.send({ deleted: true });
};