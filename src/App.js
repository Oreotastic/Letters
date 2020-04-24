import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Message from './Message';


const App = ({mailBox}) => {

 
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
              <img src={mailBox} alt="mailBox.png" border="0" />
              <Message />
              <img src="https://i.imgur.com/aYFTpGO.png"/>
            </Route>
          </Switch>
        </div>
      </Router>

    </div>
  );
};

export default App;
