const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log("Error caught");
});

const seedDB = async () => {
    await Listing.deleteMany({});
    initData.data  = initData.data.map((obj)=>({ ...obj, owner:"68c1da1ed49d1a1a07f8e5be"}));
    await Listing.insertMany(initData.data);
    console.log("DB Seeded");
};

seedDB();
