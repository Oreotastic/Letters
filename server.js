const express = require('express')
const app = express()
const db = require('./db')
const path = require('path')
const keys = require('./config/keys')

const passport = require('passport')
const cookieSession = require('cookie-session')
const passportSetup = require('./config/passport-setup')

const io = require('socket.io')
const http = require('http')

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

// Socket.io 
const server = http.createServer(app)
const socketIo = io(server)

socketIo.on('connection', (client) => {
  console.log('new user connected')
  client.on('jointhread', (room) => {
    client.join(room)
    socketIo.emit('joined room ' + room)
  })
  client.on('chat message', (data) => {
    socketIo.in(room).emit('chat message', data)

    if(user.id !== user) {
      console.log(room, msg, user)
    }
  })
  client.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

//init passport 
app.use(passport.initialize()) 
app.use(passport.session())

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile']
}))

app.get('/auth/logout', (req, res, next) => {
  req.logout()
  res.redirect('/')
})

app.get('/auth/loggedin', (req, res, next) => {
  res.send(req.user)
})

app.get('/auth/google/redirect', passport.authenticate('google'), (req, res, next) => {
  res.redirect('/')
})

//Routing for database user functions
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
  const senderId = req.body.sender
  const receiver = req.body.receiver
  const threadId = req.body.threadId
  db.createReply(threadId, senderId, receiver, reply)
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

app.get('/api/sentThreads/:id', (req, res, next) => {
  const id = req.params.id
  db.getSentThreads(id)
    .then(response => res.send(response))
    .catch(next)
})

app.get('/api/receivedThreads/:id', (req, res, next) => {
  const id = req.params.id
  db.getReceivedThreads(id)
    .then(response => res.send(response))
    .catch(next)
})

app.get('/api/threads', (req, res, next) => {
  db.getThreads()
    .then(response => res.send(response))
    .catch(next)
})

app.get('/api/threads/:id', (req, res, next) => {
  const id = req.params.id
  db.getThread(id)
    .then(response => res.send(response))
    .catch(next)
})

app.put('/api/threads/:id', (req, res, next) => {
  const id = req.params.id 
  const msgArr = req.body.msgArr
  db.updateThread(msgArr, id)
    .then(response => res.send(response))
    .catch(next)
})

app.post('/api/threads', (req, res, next) => {
  const msgArr = req.body.msgArr
  const sender = req.body.sender
  const receiver = req.body.receiver
  db.createThread(msgArr, sender, receiver)
    .then(response => res.send(response))
    .catch(next)
})

app.get('*', (req, res, next) => {
  res.redirect('/')
})

db.sync().then(() => {
  server.listen(port, () => {
    console.log(`listening on port ${port}`)
  });
});
