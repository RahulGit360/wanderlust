const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');

const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');



// index
router.get('/', wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index', { allListings });
}));

// new
router.get('/new',isLoggedIn , (req, res) => {
  res.render('listings/new');
});

// create
router.post('/', validateListing, isLoggedIn, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  console.log(req.user);
  newListing.owner = req.user._id;
  await Listing.create(newListing);
  req.flash('success', 'Successfully made a new listing!');
  res.redirect('/listings');
}));

// show
router.get('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate('reviews').populate('owner');
  if (!listing) {
    req.flash('error', 'Listing your looking for does not exist!');
    return res.redirect('/listings');
  }else{
  res.render('listings/show', { listing });
  console.log(listing);
}
}));

// edit
router.get('/:id/edit', isLoggedIn, isOwner,  wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError('Listing not found', 404);
  res.render('listings/edit', { listing });
}));

// update
router.put('/:id',isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updatedListing = req.body.listing;
  await Listing.findByIdAndUpdate(id, updatedListing, { new: true });
  req.flash('success', 'Successfully updated the listing!');
  res.redirect(`/listings/${id}`);
}));

// delete
router.delete('/:id',isLoggedIn,isOwner,  wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a new listing!');
  res.redirect('/listings');
}));

module.exports = router;
