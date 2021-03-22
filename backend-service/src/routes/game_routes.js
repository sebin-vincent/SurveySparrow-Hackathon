const express = require('express');

const authorise = require('../middleware/authorisationhandler');
const asyncHandler = require('../middleware/asynchandler');
const gameController = require('../controller/game_controller');

const router = express.Router();


router.get('/:gamePin/leaderBoard', authorise, asyncHandler(gameController.getGameLeaderBoard));
router.get('/:gamePin/lock-toggle', authorise, asyncHandler, gameController.toggleGameLock);

module.exports = router;