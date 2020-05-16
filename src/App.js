import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import axios from 'axios'
import Home from './Home'
import Login from './Login'
import Profile from './Profile'
import Replies from './Replies'

const App = () => {
 
  const [letter, setLetter] = useState({})
  const [user, setUser] = useState('')
  const [myLetter, setMyLetter] = useState('')
  const [msgs, setMsgs] = useState([])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    axios.get('/api/letters', {signal: signal})
      .then(response => response.data.length)
      .then(length => {
        const id = Math.ceil(Math.random() * length)
        axios.get(`/api/letters/${id}`)
        .then(response => setLetter(response.data))
      })
    
    return () => {
      abortController.abort()
    }
  }, [])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    axios.get('/auth/loggedin', {signal: signal})
      .then(res => setUser(res.data))
    
    return () => {
      abortController.abort()
    }
  }, [])

  const createMessage = async(msg, userId) => {
    if(msg !== '') {
      axios.post('/api/letters', {msg: msg, userId: userId})
      setMyLetter('')
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
      setMyLetter('')
      const msgArr = [{userId: receiver, reply: endMsg}, {userId: sender, reply: reply}]
      const thread = await createThread(msgArr, sender, receiver)
      await axios.post('/api/replies', {sender: sender, threadId: thread.id, receiver: receiver, reply: reply})
    }
  }

  const openLetter = async() => {
    const total = (await axios.get('/api/letters')).data.length
    const id = Math.ceil(Math.random() * total)
    const msg = (await axios.get(`/api/letters/${id}`)).data
    setLetter(msg)
  }

  return (
    <div>
      <Router>
        <header>
          <nav>
              {
                user === '' ? 
                <ul className="navbar">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Login />
                  </li>
                </ul>
                  :
                <ul className="navbar">
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <a href="/auth/logout">
                      <button>
                        Logout
                      </button>
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
              <Replies msgs={msgs} setMsgs={setMsgs} user={user} updateThread={updateThread} myLetter={myLetter} setMyLetter={setMyLetter} />
            </Route>
          </Switch>
        </div>

      </Router>

    </div>
  )
}

export default App
