const express = require('express');
const router = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');


const Listing = require('../models/listing');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviewController = require('../controllers/reviews');
const { createReview, deleteReview } = reviewController;



// validator


// CREATE review: POST /listings/:id/reviews
router.post('/', isLoggedIn, validateReview, wrapAsync(createReview));

// DELETE review: DELETE /listings/:id/reviews/:reviewId
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,  wrapAsync(deleteReview));

module.exports = router;
