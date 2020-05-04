import React, {useState} from 'react'
import Message from './Message'
import Letter from './Letter'

const Home = ({myLetter, setMyLetter, letter, createMessage, openLetter, createReply, user}) => {

  return (
    <div id="home">
      <Message letter={letter.message}/>
      <div id="icons">
        <img className="icon mail" src="https://i.imgur.com/ZfdKyDZ.png" alt="envelope" onClick={openLetter}/>
        {letter.userid ? <img className="icon paper" src="https://i.imgur.com/2MT34wZ.png" alt="paper" onClick={() => createReply(letter.userid, letter.id, myLetter)}/> : null}
        <img className="icon mailbox" src="https://i.imgur.com/DgMZXbw.png" alt="mailbox" onClick={() => createMessage(myLetter, user.id)}/>
      </div>
      <Letter myLetter={myLetter} setMyLetter={setMyLetter}/>
    </div>
  )
}

export default Home