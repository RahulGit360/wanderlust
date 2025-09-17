const Listing = require('../models/listing');
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index', { allListings });
  };
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');
  };
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id;
    await Listing.create(newListing);
    req.flash('success', 'Successfully made a new listing!');
    res.redirect('/listings');
  };
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:'reviews', 
      populate: {path: "author"}}).populate('owner');
    if (!listing) {
      req.flash('error', 'Listing your looking for does not exist!');
      return res.redirect('/listings');
    }else{
    res.render('listings/show', { listing });
  }
  };
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError('Listing not found', 404);
  res.render('listings/edit', { listing });
};
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const updatedListing = req.body.listing;
    await Listing.findByIdAndUpdate(id, updatedListing, { new: true });
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${id}`);
  };
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a new listing!');
  res.redirect('/listings');
};