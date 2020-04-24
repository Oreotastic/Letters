import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import mailBox from "./assets/mailBox.png";

const root = document.querySelector('#root')

ReactDOM.render(<App mailBox={mailBox}/>, root);