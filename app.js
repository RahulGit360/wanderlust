const express = require('express');   // requiresing expresess
const app = express();         // assigning express variable to app
const mongoose = require('mongoose');  // Requiring mongoose
const PORT = 8080; // assigning port number to a variable
const Listing = require('./models/listing'); 
const path = require('path'); // Requiring path module

const methodOverride = require('method-override');
// Requiring method-override to support PUT and DELETE methods in forms
app.use(methodOverride('_method')); // Middleware to override HTTP methods using query parameters
// Setting up the Express application

app.set('view engine', 'ejs'); // Setting the view engine to EJS
app.set('views',path.join(__dirname,'views')); // Setting the views directory to 'views' folder in the current directory
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory
app.use(express.urlencoded({ extended: true})); // Middleware to parse URL-encoded bodies (form submissions)
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

// Route to get all listings and render them using EJS template
app.get('/listings', async (req, res) => {
    try {
      const allListings = await Listing.find({});
      res.render('listings/index', { allListings });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching listings");
    }
  });

  //new route
app.get('/listings/new', (req,res)=>{
    res.render('listings/new');
});

//show route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show', {listing});
});

// create route
app.post('/listings', async (req,res)=>{
    let newListing = req.body.listing; // Extracting listing data from the request body
    try{
        await Listing.create(newListing);
        res.redirect('/listings');
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error creating listing");
    }

});

//edit route
app.get('/listings/:id/edit', async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", {listing});
});

//update route
app.put('/listings/:id', async (req,res)=>{
    try{
    let {id} = req.params; // Extracting the ID from the request parameters
    let updatedListing = req.body.listing; // Extracting updated listing data from the request body
    await Listing.findByIdAndUpdate(id, updatedListing, {new: true}) // Updating the listing in the database
    res.redirect(`/listings/${id}`); // Redirecting to the updated listing's show page
    }
    catch(err){ 
        console.error(err);
        res.status(500).send("Error updating listing");
        }
});

//delete route
app.delete('/listings/:id', async (req,res)=>{
    try{
    let {id} = req.params; // Extracting the ID from the request parameters
    await Listing.findByIdAndDelete(id); // Deleting the listing from the database
    res.redirect('/listings'); // Redirecting to the listings index page
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error deleting listing");
    }
}
);


