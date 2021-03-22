const express = require('express');

const authorise = require('../middleware/authorisationhandler');
const asyncHandler = require('../middleware/asynchandler');
const collectionController = require('../controller/collection_controller');

const router = express.Router();

router.post('/', authorise, asyncHandler(collectionController.createCollection));
router.get('/', authorise, asyncHandler(collectionController.getCollections));
router.get('/:id', authorise, asyncHandler(collectionController.getCollectionById));
router.put('/:id', authorise, asyncHandler(collectionController.updateCollection));
router.delete('/:id', authorise, asyncHandler(collectionController.deleteCollection));

module.exports = router;