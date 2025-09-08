const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');

const Listing = require('../models/listing');
const { listingSchema } = require('../schema'); // Joi schema

// validators
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(msg, 400);
  }
  next();
};

// index
router.get('/', wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index', { allListings });
}));

// new
router.get('/new', (req, res) => {
  res.render('listings/new');
});

// create
router.post('/', validateListing, wrapAsync(async (req, res) => {
  // expects fields like name="listing[title]" etc.
  const newListing = req.body.listing;
  await Listing.create(newListing);
  req.flash('success', 'Successfully made a new listing!');
  res.redirect('/listings');
}));

// show
router.get('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate('reviews');
  if (!listing) {
    req.flash('error', 'Listing your looking for does not exist!');
    return res.redirect('/listings');
  }else{
  res.render('listings/show', { listing });}
}));

// edit
router.get('/:id/edit', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError('Listing not found', 404);
  res.render('listings/edit', { listing });
}));

// update
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updatedListing = req.body.listing;
  await Listing.findByIdAndUpdate(id, updatedListing, { new: true });
  req.flash('success', 'Successfully updated the listing!');
  res.redirect(`/listings/${id}`);
}));

// delete
router.delete('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a new listing!');
  res.redirect('/listings');
}));

module.exports = router;
