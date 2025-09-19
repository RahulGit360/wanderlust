if(process.env.NODE_ENV !== "production") { 
  require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const ExpressError = require('./utils/ExpressError');

const listingsRoutes = require('./routes/listings'); // <-- this must exist
const reviewRoutes = require('./routes/review'); // <-- this must exist
const userRoutes = require('./routes/user'); // <-- this must exist

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const PORT = 8080;
const dbUrl = process.env.ATLASDB_URL;

// view engine & middleware
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const store =  MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600,
});

store.on("error", function(e){
  console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {
    secret: process.env.SECRET,
    store: store,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());   

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    let currentUser = req.user;
    res.locals.currentUser = currentUser;
    next();
});

app.use('/listings', listingsRoutes);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

// 404
app.use(/.*/, (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// error handler
app.use((err, req, res, next) => {
  const { message = 'Something went wrong', statusCode = 500 } = err;
  res.status(statusCode).render('listings/error', { message });
});

// db + start
async function main() { await mongoose.connect(dbUrl); }
main()
  .then(() => console.log('connected to DB'))
  .catch((err) => console.error('DB connection error:', err));

app.listen(PORT, () => {
  console.log('app is listening on server 8080');
});
