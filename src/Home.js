import React from 'react'
import Message from './Message'
import Letter from './Letter'

const Home = () => {

  return (
    <div id="home">
      <Message />
      <div id="icons">
        <img className="icon mail" src="https://i.imgur.com/ZfdKyDZ.png" alt="envelope"/>
        <img className="icon mailbox" src="https://i.imgur.com/DgMZXbw.png" alt="mailbox"/>
      </div>
      <Letter />
    </div>
  )
}

export default Home