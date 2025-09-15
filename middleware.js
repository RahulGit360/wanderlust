const ExpressError = require('./utils/ExpressError');
const { listingSchema } = require('./schema'); 
const Listing = require('./models/listing');


module.exports.validateListing = (req, res, next) => {
        const { error } = listingSchema.validate(req.body);
        if (error) {
          const msg = error.details.map(el => el.message).join(', ');
          throw new ExpressError(msg, 400);
        }
        next();
      };



module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    await Listing.findById(id)
        .then(listing => {
            if (!listing.owner.equals(req.user._id)) {
                req.flash('error', 'You do not have permission to do that!');
                return res.redirect(`/listings/${id}`);
            }
            next();
        })
        .catch(err => next(err));
};

module.exports.validateReview = (req, res, next) => {
        const { error } = reviewSchema.validate(req.body);
        if (error) {
          const msg = error.details.map(el => el.message).join(', ');
          throw new ExpressError(msg, 400);
        }
        next();
      };
