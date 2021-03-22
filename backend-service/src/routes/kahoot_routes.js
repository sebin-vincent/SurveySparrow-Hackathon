const express = require('express');
const asyncHandler = require('../middleware/asynchandler');
const authorise = require('../middleware/authorisationhandler');

const kahootController = require('../controller/kahoot_controller');

const router = express.Router();

router.post('/draft', authorise, asyncHandler(kahootController.draftKahoot));
router.get('/', authorise, asyncHandler(kahootController.getKahoots));
router.get('/:id', authorise, asyncHandler(kahootController.getKahootById));
router.put('/:id', authorise, asyncHandler(kahootController.updateKahoot));
router.put('/:id/ready', authorise, asyncHandler(kahootController.readyKahoot));
router.post('/:kahootId/collection/:collectionId', authorise, asyncHandler(kahootController.addKahootToCollection));
router.delete('/:id', authorise, asyncHandler(kahootController.deleteKahoot));

router.post('/:id/questions', authorise, asyncHandler(kahootController.addQuestion));
router.post('/:kahootId/questions/:questionId', authorise, asyncHandler(kahootController.updateQuestion));
router.delete('/:kahootId/questions/:questionId', authorise, asyncHandler(kahootController.deleteQuestion));



module.exports = router;