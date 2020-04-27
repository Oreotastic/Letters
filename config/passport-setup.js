const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const keys = require('./keys')
const db = require('../db')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  db.getUser(id).then((user) => {
    done(null, user)
  })
})

passport.use(new GoogleStrategy({
  callbackURL: '/auth/google/redirect',
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret
}, (accessToken, refreshToken, profile, done) => {
    db.createUser(profile.id, profile.displayName)
    .then((user) => done(null, user))
  })
)