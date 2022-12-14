const mongoose = require('mongoose')
require('dotenv').config()
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');

const alumniSchema = require("../models/model").alumniSchema;
const connectToDb = require('../dbConnect');
const MONGOOSE_URL = process.env.MONGOOSE_URL
const conn = mongoose.createConnection(MONGOOSE_URL);
const AlumniModel = conn.model('Alumni', alumniSchema);
const alumni = new AlumniModel;


const userController = require('../controllers/usercontroller');
const donationFormController = require('../controllers/donationpageform');
const dashboardController = require('../controllers/dashboard');
const pageController = require('../controllers/createdonation');


const signupController = require('../controllers/signup');


passport.use(new LocalStrategy({
  usernameField: 'alumn[email]',
  passwordField: 'alumn[password]',
}, function verify(email, password, done) {
  alumni.findOne({ email })
    .then((alumni) => {
      if (!alumni) {
        return done(null, false, { errors: { 'email': 'is invalid' } });
      }
      const hash = crypto.pbkdf2Sync(password, alumni.salt, 310000, 32, 'sha256').toString('hex');

      if (!hash == alumni.password) {
        return done(null, false, { errors: { 'password': 'is invalid' } });
      }
      return done(null, alumni);
    }).catch(done);
}));





passport.serializeUser(function (alumni, done) {

  done(null, { id: alumni.id, username: alumni.username });

});

passport.deserializeUser(function (id, done) {
  alumni.findById(id, function (err, user) {
    done(err, user);
  });
});
router.post('/login/password', passport.authenticate('local', {
  failureRedirect: '/login'
}), dashboardController.dashboardcont
);
router.get('/signup', signupController.signUpCont);
router.post('/signup/post', userController.signup);
router.get('/donationform', passport.authorize(
  'local', { failureRedirect: '/login' }), donationFormController.donationPageCont);
router.get('/create-page', passport.authorize(
  'local', { failureRedirect: '/login' }), pageController.createPageCont);
module.exports = router;
