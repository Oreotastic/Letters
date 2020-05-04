const express = require('express')
const app = express()
const db = require('./db')
const path = require('path')
const passport = require('passport')
const cookieSession = require('cookie-session')
const passportSetup = require('./config/passport-setup')
const keys = require('./config/keys')

const port = process.env.PORT || 3000;


app.use('/dist', express.static(path.join(__dirname, 'dist')))
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/src/assets', express.static(path.join(__dirname, 'assets')))

app.use(express.json()) 

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.cookieSession.cookieKey]
}))

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})


//init passport 
app.use(passport.initialize())
app.use(passport.session())

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile']
}))

app.get('/auth/logout', (req, res, next) => {
  res.send('logged out')
})

app.get('/auth/loggedin', (req, res, next) => {
  res.send(req.user)
})

app.get('/auth/google/redirect', passport.authenticate('google'), (req, res, next) => {
  res.redirect('/')
})

app.get('/api/letters', (req, res, next) => {
  db.getMessages()
    .then(response => res.send(response))
    .catch(next)
})

app.get('/api/letters/:id', (req, res, next) => {
  const id = req.params.id
  db.getMessage(id)
    .then(response => res.send(response))
    .catch(next)
})

app.post('/api/letters', (req, res, next) => {
  const msg = req.body.msg
  const userId = req.body.userId
  db.createMessage(msg, userId)
    .then(response => res.send(response))
    .catch(next)
})

app.post('/api/replies', (req, res, next) => {
  const reply = req.body.reply
  const userId = req.body.userId
  const msgId = req.body.msgId
  db.createReply(userId, msgId, reply)
    .then(response => res.send(response))
    .catch(next)
})

app.get('/api/replies', (req, res, next) => {
  db.getReplies()
    .then(response => res.send(response))
    .catch(next)
})

app.get('/api/replies/:id', (req, res, next) => {
  const myId = req.params.id
  db.getMyReplies(myId)
    .then(response => res.send(response))
    .catch(next)
})

app.get('*', (req, res, next) => {
  res.redirect('/')
})
db.sync().then(() => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  });
});
