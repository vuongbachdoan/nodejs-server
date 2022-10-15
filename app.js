const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const ejs = require('ejs')
const passport = require('passport')
require('dotenv').config()
const courseRoutes = require('./routes/CourseRouter')
const userRoutes = require('./routes/UserRouter')
const config = require('./configuration/config')

mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log('Database connected')
    })
    .catch((err) => {
        console.log(err)
    })


passport.serializeUser((user, cb) => {
    cb(null, user)
})
passport.deserializeUser((obj, cb) => {
    cb(null, obj)
})

var userProfile
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:4200/auth/google/callback'
}
    , function (accessToken, refreshToken, profile, done) {
        userProfile = profile;
        return done(null, userProfile);
    }
))
const FacebookStrategy = require('passport-facebook').Strategy
passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret: config.facebook_api_secret,
    callbackURL: config.callback_url
},
    function (accessToken, refreshToken, profile, done) {
        userProfile = profile;
        return done(null, userProfile);
    }
));
app.use(session({
    resave: false,
    saveUninitialized: true,
    // secret: GOOGLE_CLIENT_SECRET
    secret: config.facebook_api_secret
}));
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use('/course', courseRoutes)
app.use('/user', userRoutes)
/**
 * Below route is for authentication
 */
app.get('/', (req, res) => {
    res.render('pages/auth')
})
app.get('/success', (req, res) => {
    res.send(userProfile)
})
app.get('/error', (req, res) => {
    res.send('Error logging')
})
app.get(
    '/auth/google',
    passport.authenticate(
        'google',
        { scope: ['profile', 'email'] },
    ));
app.get(
    '/auth/google/callback',
    passport.authenticate(
        'google',
        { failureRedirect: '/error' },
    ),
    function (req, res) {
        res.redirect('/success');
    });

app.get("/facebook-login", (req, res) => {
    res.render("pages/facebook_auth")
})
app.get('/success-facebook', (req, res) => {
    res.send(userProfile)
})
app.get("/auth/facebook", passport.authenticate("facebook"))
app.get(
    "/auth/facebook/callback",
    passport.authenticate(
        "facebook",
        { failureRedirect: "/" }
    ),
    function (req, res) {
        res.redirect('/success-facebook')
    }
)

app.listen(process.env.PORT, () => {
    console.log(`App listening on port: ${process.env.PORT}`)
})