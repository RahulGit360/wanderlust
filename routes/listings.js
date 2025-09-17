const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');

const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const listingController = require('../controllers/listings');
const { index, renderNewForm, createListing , showListing, renderEditForm, updateListing, deleteListing} = listingController;
const ExpressError = require('../utils/ExpressError');

router
    .route('/').get(wrapAsync(index))
    .post(validateListing, isLoggedIn, wrapAsync(createListing));  
// index // create


// new
router.get('/new',isLoggedIn ,renderNewForm);

router
    .route('/:id')
    .get(wrapAsync(showListing))
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(updateListing))
    .delete(isLoggedIn,isOwner,  wrapAsync(deleteListing));
// show // update // delete


// edit
router.get('/:id/edit', isLoggedIn, isOwner,  wrapAsync(renderEditForm));


module.exports = router;
