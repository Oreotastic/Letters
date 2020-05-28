import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import {Button, ThemeProvider, createMuiTheme} from '@material-ui/core'
import axios from 'axios'
import Home from './Home'
import Login from './Login'
import Profile from './Profile'
import Replies from './Replies'
import socketIOClient from 'socket.io-client'

const ENDPOINT = 'http://localhost:3000/'

const socket = socketIOClient(ENDPOINT)

const App = () => {
 
  const [letter, setLetter] = useState({})
  const [user, setUser] = useState('')
  const [myLetter, setMyLetter] = useState('')
  const [msgs, setMsgs] = useState([])
  const [room, setRoom] = useState('')

  socket.emit('jointhread', room)
  socket.on('chat message', (room, msg, userId) => {
    if(userId !== user.id) {
      setMsgs([...msgs, {userId: userId, reply: msg}])
      const messageBody = document.querySelector('.thread-container ul');
      messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    }
  })

  useEffect(() => {
    axios.get('/api/letters')
      .then(response => response.data.length)
      .then(length => {
        const id = Math.ceil(Math.random() * length)
        axios.get(`/api/letters/${id}`)
        .then(response => setLetter(response.data))
      })
  }, [])

  useEffect(() => {
    axios.get('/auth/loggedin')
      .then(res => setUser(res.data))
  }, [])

  const createMessage = async(msg, userId) => {
    if(msg !== '') {
      const prog = document.querySelector('.progress-circle')
      prog.classList.remove('hidden')
      axios.post('/api/letters', {msg: msg, userId: userId})
        .then(() => prog.classList.toggle('hidden'))
        .then(() => setMyLetter(''))
    }
  }

  const createReply = async(threadId, userId, reply) => {
    if(reply !== '') {
      axios.post('/api/replies', {threadId: threadId, sender: user.id, receiver: userId, reply: reply})
      setMyLetter('')
    }
  }

  const updateThread = async(threadId, userId, reply) => {
    if(reply !== '') {
      const thread = (await axios.get(`/api/threads/${threadId}`)).data
      const message = {userId: userId, reply: reply}
      const msgArr = [...thread.msgs, message]
      setMsgs(msgArr)
      const messageBody = document.querySelector('.thread-container ul');
      messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
      const newThread = (await axios.put(`/api/threads/${threadId}`, {msgArr: msgArr})).data
      await axios.post('/api/replies', {threadId: threadId, sender: user.id, receiver: userId, reply: reply})
    }
  }

  const createThread = async(msgArr, sender, receiver) => {
    const thread = (await axios.post('/api/threads', {msgArr: msgArr, sender: sender, receiver: receiver})).data
    return thread
  }

  const createReplyAndThread = async(endMsg, receiver, reply) => {
    const sender = user.id
    if(reply !== '') {
      const prog = document.querySelector('.progress-circle')
      prog.classList.remove('hidden')
      setMyLetter('')
      const msgArr = [{userId: receiver, reply: endMsg}, {userId: sender, reply: reply}]
      const thread = await createThread(msgArr, sender, receiver)
      await axios.post('/api/replies', {sender: sender, threadId: thread.id, receiver: receiver, reply: reply})
      prog.classList.toggle('hidden')
    }
  }

  const openLetter = async() => {
    const prog = document.querySelector('.progress-circle')
    prog.classList.remove('hidden')
    const total = (await axios.get('/api/letters')).data.length
    const id = Math.ceil(Math.random() * total)
    const msg = (await axios.get(`/api/letters/${id}`)).data
    setLetter(msg)
    prog.classList.toggle('hidden')
  }

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#89DAFF'
      },
    }
  })

  return (
    <div>
      <Router>
        <header>
          <nav>
              {
                user === '' ? 
                <ul className="navbar">
                  <li>
                    <Link to="/">
                      <ThemeProvider theme={theme}>
                        <Button variant="contained" color="primary">Home</Button>
                      </ThemeProvider>
                    </Link>
                  </li>
                  <li>
                    <Login theme={theme} ThemeProvider={ThemeProvider}/>
                  </li>
                </ul>
                  :
                <ul className="navbar">
                  <li>
                    <Link to="/profile">
                      <ThemeProvider theme={theme}>
                        <Button variant="contained" color="primary">Profile</Button>
                      </ThemeProvider>
                    </Link>
                  </li>
                  <li>
                    <Link to="/">
                      <ThemeProvider theme={theme}>
                        <Button variant="contained" color="primary">Home</Button>
                      </ThemeProvider>
                    </Link>
                  </li>
                  <li>
                    <a href="/auth/logout">
                      <ThemeProvider theme={theme}>
                        <Button variant="contained" color="primary">Logout</Button>
                      </ThemeProvider>
                    </a>
                  </li>
                </ul>
              }
          </nav>
        </header>

        <div id="app" className="container">
          <Switch>
            <Route exact path='/profile'>
              <Profile myLetter={myLetter} setMyLetter={setMyLetter} user={user} createReply={createReply}/>
            </Route>
            <Route exact path="/">
              <Home myLetter={myLetter} setMyLetter={setMyLetter} letter={letter} createMessage={createMessage} openLetter={openLetter} createReplyAndThread={createReplyAndThread} user={user}/>
            </Route>
            <Route exact path={`/thread/:id`}>
              <Replies room={room} setRoom={setRoom} msgs={msgs} setMsgs={setMsgs} user={user} updateThread={updateThread} myLetter={myLetter} setMyLetter={setMyLetter}/>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App
