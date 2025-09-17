const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');

const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const listingController = require('../controllers/listings');
const { index, renderNewForm, createListing , showListing, renderEditForm, updateListing, deleteListing} = listingController;
const ExpressError = require('../utils/ExpressError');



// index
router.get('/', wrapAsync(index));

// new
router.get('/new',isLoggedIn ,renderNewForm);

// create
router.post('/', validateListing, isLoggedIn, wrapAsync(createListing));

// show
router.get('/:id', wrapAsync(showListing));

// edit
router.get('/:id/edit', isLoggedIn, isOwner,  wrapAsync(renderEditForm));

// update
router.put('/:id',isLoggedIn, isOwner, validateListing, wrapAsync(updateListing));

// delete
router.delete('/:id',isLoggedIn,isOwner,  wrapAsync(deleteListing));

module.exports = router;
