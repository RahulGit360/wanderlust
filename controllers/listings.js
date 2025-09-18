const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index', { allListings });
  };
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');
  };
module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    }).send();
    let filename = req.file.filename;
    let url = req.file.path;
    req.body.listing.image = {url, filename};
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    await Listing.create(newListing);
    console.log(newListing);
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
    let listing = await Listing.findByIdAndUpdate(id, updatedListing, { new: true });
    if (req.file) {
      const { filename, path: url } = req.file;
      listing.image = { url, filename };
      await listing.save();
  }
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${id}`);
  };
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted a new listing!');
  res.redirect('/listings');
};