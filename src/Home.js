import React, {useState} from 'react'
import Message from './Message'
import Letter from './Letter'

const Home = ({letter, createMessage, openLetter}) => {

  const [myLetter, setMyLetter] = useState('')

  return (
    <div id="home">
      <Message letter={letter}/>
      <div id="icons">
        <img className="icon mail" src="https://i.imgur.com/ZfdKyDZ.png" alt="envelope" onClick={openLetter}/>
        <img className="icon mailbox" src="https://i.imgur.com/DgMZXbw.png" alt="mailbox" onClick={() => createMessage(myLetter)}/>
      </div>
      <Letter myLetter={myLetter} setMyLetter={setMyLetter}/>
    </div>
  )
}

export default Home