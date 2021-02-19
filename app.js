if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
console.log(process.env.SECRET);

// Requiring express, mongoose, method-override and other APIs.
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const dbUrl=process.env.DB_URL||'mongodb://localhost:27017/petfinder';
const MongoDBStore=require("connect-mongo")(session);

// Requiring schema.
const User = require('./models/user');

// Connecting to mongoose with database as petfinder.
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// If successfully connected to database, console will print out "Datebase connected".
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Require Routes
const lostPetFinderRoutes = require('./routes/petfinder');
const commentsRoutes = require('./routes/comment');
const shelterRoutes = require('./routes/shelter');
const petAdoptionRoutes = require('./routes/petAdoption');
const userRoutes = require('./routes/user');
const customerRoutes = require('./routes/customer');

// Set view engine as ejs.
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dtabf2eam/", 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const store=new MongoDBStore({
    url:dbUrl,
    secret:"This a secret storage for session.",
    touchAfter:24*60*60,
});

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    name: "session",
    secret: 'this is a secret, dont tell anyone',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set HOME Page to 'home.ejs'
app.get('/', (req, res) => {
    res.render('home')
});

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use("/", userRoutes);
app.use("/shelter", shelterRoutes);
app.use("/petfinder", lostPetFinderRoutes);
app.use("/", commentsRoutes);
app.use("/", customerRoutes);
app.use("/petAdoption", petAdoptionRoutes);


//When catchAsync function catches a error, it will call this function:
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "SOMETHING WENT WRONG!!!!!";
    res.status(statusCode).render('error', { err });
});

// Set up Show page to 'show.ejs'
const port=process.env.PORT||4000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})
