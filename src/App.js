import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import axios from 'axios'
import Home from './Home'
import Login from './Login'
import Profile from './Profile'

const App = () => {
 
  const [letter, setLetter] = useState({})
  const [user, setUser] = useState('')
  const [replies, setReplies] = useState([])
  const [myLetter, setMyLetter] = useState('')

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
    if(user !== '') {
      axios.get(`/api/replies/${user.id}`)
        .then(response => setReplies(response.data))
    }
  })

  useEffect(() => {
    axios.get('/auth/loggedin')
      .then(res => setUser(res.data))
  }, [])

  const createMessage = async(msg, userId) => {
    console.log(msg)
    if(msg.split('').length > 10) {
      axios.post('/api/letters', {msg: msg, userId: userId})
    }
  }

  const createReply = async(userId, msgId, reply) => {
    console.log(reply)
    if(reply.split('').length > 10) {
      axios.post('/api/replies', {userId: userId, msgId: msgId, reply: reply})
    }
  }

  const openLetter = async() => {
    const total = (await axios.get('/api/letters')).data.length
    const id = Math.ceil(Math.random() * total)
    const msg = (await axios.get(`/api/letters/${id}`)).data
    setLetter(msg)
    console.log(msg)
  }

  return (
    <div>
      <Router>
        <header>
          <nav>
              {
                user === '' ? 
                <ul>
                  <li>
                    <Link to="/">Login</Link>
                  </li>
                  <li>
                    <Link to="/home">Home</Link>
                  </li>
                </ul>
                  :
                <ul>
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                </ul>
              }
          </nav>
        </header>

        <div id="app" className="container">

          {
          user === '' ? 
            <Switch>
              <Route exact path='/'>
                <Login />
              </Route>
              <Route exact path="/home">
                <Home myLetter={myLetter} setMyLetter={setMyLetter} letter={letter} createMessage={createMessage} openLetter={openLetter} createReply={createReply} user={user}/>
              </Route>
            </Switch>
              :
            <Switch>
              <Route exact path='/profile'>
                <Profile myLetter={myLetter} setMyLetter={setMyLetter} user={user} replies={replies} createReply={createReply}/>
              </Route>
              <Route exact path="/">
                <Home myLetter={myLetter} setMyLetter={setMyLetter} letter={letter} createMessage={createMessage} openLetter={openLetter} createReply={createReply} user={user}/>
              </Route>
            </Switch>
          }
        </div>

      </Router>

    </div>
  )
}

export default App
