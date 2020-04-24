import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Message from './Message';

const App = () => {

 
  return (
    <div>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
        <div id="app">
          <Switch>
            <Route exact path="/">
              <h1>Welcome</h1>
              <img className="icon" src="https://i.imgur.com/DgMZXbw.png"/>
              
              <Message />
              <img className="icon" src="https://i.imgur.com/F3NOSvU.png" width="200px"/>
            </Route>
          </Switch>
        </div>
      </Router>

    </div>
  );
};

export default App;
