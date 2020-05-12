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
  const [replies, setReplies] = useState([])
  const [myLetter, setMyLetter] = useState('')

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
    console.log(msg)
    if(msg.split('').length > 10) {
      axios.post('/api/letters', {msg: msg, userId: userId})
      setMyLetter('')
    }
  }

  const createReply = async(userId, msgId, reply) => {
    if(reply.split('').length > 10) {
      axios.post('/api/replies', {userId: userId, msgId: msgId, reply: reply})
      setMyLetter('')
    }
  }

  const createThread = async(msgJSON) => {
    const thread = (await axios.post('/api/threads', {msgArr: [msgJSON]})).data
    return thread
  }

  const createReplyAndThread = async(userId, msgId, reply) => {
    if(reply.split('').length > 5) {
      setMyLetter('')
      const msgJSON = {userId: userId, reply: reply}
      const thread = await createThread(msgJSON)
      await axios.post('/api/replies', {threadId: thread.id, userId: userId, msgId: msgId, reply: reply})
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
              <Profile setReplies={setReplies} myLetter={myLetter} setMyLetter={setMyLetter} user={user} replies={replies} createReply={createReply}/>
            </Route>
            <Route exact path="/">
              <Home myLetter={myLetter} setMyLetter={setMyLetter} letter={letter} createMessage={createMessage} openLetter={openLetter} createReplyAndThread={createReplyAndThread} user={user}/>
            </Route>
            <Route exact path={`/thread/:id`}>
              <Replies user={user} createReply={createReply} myLetter={myLetter} setMyLetter={setMyLetter} />
            </Route>
          </Switch>
        </div>

      </Router>

    </div>
  )
}

export default App
