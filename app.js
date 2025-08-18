const express = require('express');   // requiresing expresess
const app = express();         // assigning express variable to app
const mongoose = require('mongoose');  // Requiring mongoose
const PORT = 8080; // assigning port number to a variable
const Listing = require('./models/listing'); 

app.use(express.json()); // Add this before defining routes
app.get("/", (req,res)=>{
    res.send("Hi, I am root");
});

app.listen(PORT, ()=>{
    console.log("app is listening on server 8080"); // .listen is a method that makes express to listen for incoming http requests on the paticular port3
});

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log("Error caught");
});

app.get("/test", async (req,res)=>{
    let sampleListing = new Listing({
        title: "House",
        description: "land maimi house",
        image: '',
        price: 5000,
        location: "miami, FL",
        country: "FL,USA",
    });
    await sampleListing.save();
    console.log(sampleListing);
    res.send("successful");

});