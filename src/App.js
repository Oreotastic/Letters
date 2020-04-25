import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios'
import Home from './Home';

const App = () => {
 
  const [letter, setLetter] = useState('')
  const [myLetter, setMyLetter] = useState('')

  useEffect(() => {
    axios.get('/api/letters')
      .then(response => response.data.length)
      .then(length => {
        axios.get(`/api/letters/${Number(1)}`)
        .then(response => console.log(response))
      })
  }, [])

  return (
    <div>
      <Router>
        <header>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
            </ul>
          </nav>
          <h1>Welcome</h1>
        </header>

        <div id="app" className="container">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </div>

      </Router>

    </div>
  );
};

export default App;
