const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DEFAULT_IMG = "https://www.citypng.com/photo/5504/hd-dota-2-official-logo-png";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
    type: String,
    default: DEFAULT_IMG,
    set: (v) => {
        if (v == null) return DEFAULT_IMG;               // null/undefined
        if (typeof v === 'object') return v.url || DEFAULT_IMG; // { filename, url }
        if (typeof v === 'string') return v.trim() === '' ? DEFAULT_IMG : v;
        return DEFAULT_IMG;
    },
    },
    price: Number,
    location: String,
    country: String,
});

// NOTE: Model name should be a string, second argument is the schema object
const Listing = mongoose.model("Listing", listingSchema);

// Export with 'exports'
module.exports = Listing;
