import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios'
import Home from './Home'
import Login from './Login'

const App = () => {
 
  const [letter, setLetter] = useState('')
  const [user, setUser] = useState('')

  useEffect(() => {
    axios.get('/api/letters')
      .then(response => response.data.length)
      .then(length => {
        const id = Math.ceil(Math.random() * length)
        axios.get(`/api/letters/${id}`)
        .then(response => setLetter(response.data.message))
      })
  }, [])

  useEffect(() => {
    axios.get('/auth/loggedin')
      .then(res => setUser(res.data))
  }, [])

  const createMessage = async(msg) => {
    if(msg.split('').length > 10) {
      axios.post('/api/letters', {msg: msg})
    }
  }

  const openLetter = async() => {
    const total = (await axios.get('/api/letters')).data.length
    const id = Math.ceil(Math.random() * total)
    const msg = (await axios.get(`/api/letters/${id}`)).data.message
    setLetter(msg)
  }

  return (
    <div>
      <Router>
        <header>
          <nav>
            <ul>
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
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                </ul>
              }
            </ul>
          </nav>
          <h1>Welcome</h1>
        </header>

        <div id="app" className="container">

          {
          user === '' ? 
            <Switch>
              <Route exact path='/'>
                <Login />
              </Route>
              <Route exact path="/home">
                <Home letter={letter} createMessage={createMessage} openLetter={openLetter}/>
              </Route>
            </Switch>
              :
            <Switch>
              <Route exact path='/login'>
                <Login />
              </Route>
              <Route exact path="/">
                <Home letter={letter} createMessage={createMessage} openLetter={openLetter}/>
              </Route>
            </Switch>
          }
        </div>

      </Router>

    </div>
  );
};

export default App;
