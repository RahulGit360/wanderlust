const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const ExpressError = require('./utils/ExpressError');

const listingsRoutes = require('./routes/listings'); // <-- this must exist
const reviewRoutes = require('./routes/review'); // <-- this must exist

const session = require('express-session');
const flash = require('express-flash');

const PORT = 8080;
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

// view engine & middleware
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: "mysecret",
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

app.get('/', (req, res) => {
  res.send('Hi, I am root');
});

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
// mount router
app.use('/listings', listingsRoutes);
app.use('listings/:id/reviews', reviewRoutes);

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
async function main() { await mongoose.connect(MONGO_URL); }
main()
  .then(() => console.log('connected to DB'))
  .catch((err) => console.error('DB connection error:', err));

app.listen(PORT, () => {
  console.log('app is listening on server 8080');
});
