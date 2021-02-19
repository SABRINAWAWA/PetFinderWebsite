// Connected to Express and Router
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { validateComment, isLoggedIn } = require('../middleware');
const commentController=require('../controllers/comment');

// Comment ==> Create new comment for the shelter
router.post('/shelter/:id/comments', isLoggedIn, validateComment, catchAsync(commentController.newComment));

//  Comment ==> Delete comments in shelter and the comment itself
router.delete('/shelter/:id/comments/:commentId', isLoggedIn, catchAsync(commentController.deleteComment));

module.exports = router;
